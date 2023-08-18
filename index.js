import dotenv from 'dotenv';
dotenv.config();
import {
    v4 as uuidv4
} from 'uuid';
import WebSocket from 'ws';
import {
    ChatGPTAPI
} from 'chatgpt';
import axios from 'axios';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import admin from 'firebase-admin';
import Keyv from 'keyv';
import KeyvFirestore from 'keyv-firestore';
import fs from 'fs';
import https from 'https';

import txt2img from './txt2img.js';
import img2img from './img2img.js';
import highresfix from './highresfix.js';

import aspectratios from './aspectratios.js';
import {
    Client,
    REST,
    Partials,
    GatewayIntentBits,
    Routes,
    ActivityType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
}
from 'discord.js';

const server_address = "127.0.0.1:8188";
const client_id = uuidv4();

const imageGenerationQueue = [];
let isProcessing = false;

const processNextInQueue = async () => {
    if (isProcessing || imageGenerationQueue.length === 0) return;

    isProcessing = true;
    const nextItem = imageGenerationQueue.shift();

    try {
        await generateImage(nextItem.mode, nextItem.prompt, nextItem.seed, nextItem.width, nextItem.height, nextItem.interaction, nextItem.question, nextItem.db);
    } catch (error) {
        console.error('Error processing image generation:', error);
    }

    isProcessing = false;
    processNextInQueue();
};

const queueImageGeneration = (mode, prompt, seed, width, height, interaction, question, db) => {
    imageGenerationQueue.push({
        mode,
        prompt,
        seed,
        width,
        height,
        interaction,
        question,
        db
    });
    processNextInQueue();
};

const generateImage = async (mode, prompt, seed, width, height, interaction, question, db) => {
   
    const xlprompt = mode;
    xlprompt["2"]["inputs"]["text_g"] = prompt;
    xlprompt["2"]["inputs"]["text_l"] = prompt;
    xlprompt["69"]["inputs"]["seed"] = seed;
    xlprompt["41"]["inputs"]["width"] = width;
    xlprompt["41"]["inputs"]["height"] = height;

    const ws = new WebSocket(`ws://${server_address}/ws?clientId=${client_id}`);

    return new Promise((resolve, reject) => {
        ws.on('open', async () => {
            try {
                const imagesData = await getImages(ws, xlprompt, interaction);
                const images = imagesData['58'];
                const buffers = images.map(image => image.data);
                const filenames = images.map(image => image.filename);
                if (buffers.length === 1) {
                    const row1 = new ActionRowBuilder().addComponents([
                        createButtonComponent(
                            "🪄 Variations",
                            `${interaction.id}#V1#SDXL#${filenames[0]}`
                        ),
                        createButtonComponent(
                            "🪄 Hires Fix",
                            `${interaction.id}#H1#SDXL#${filenames[0]}`
                        ),
                        createButtonComponent(
                            "📷",
                            `${interaction.id}#C1#SDXL#${filenames[0]}`
                        )
                    ]);

                    await interaction.editReply({
                        content: `${interaction.message.content} (Highres Fix) <@${interaction.user.id}>\n`,
                        files: [{
                            attachment: buffers[0],
                            name: filenames[0],
                            contentType: 'image/png',
                        }],
                        components: [row1]
                    });

                } else {
                    const row1 = new ActionRowBuilder().addComponents([
                        createButtonComponent(
                            "U1",
                            `0#U1#${filenames[0]}#SDXL#${interaction.id}`
                        ),
                        createButtonComponent(
                            "U2",
                            `1#U2#${filenames[1]}#SDXL#${interaction.id}`
                        ),
                        createButtonComponent(
                            "U3",
                            `2#U3#${filenames[2]}#SDXL#${interaction.id}`
                        ),
                        createButtonComponent(
                            "U4",
                            `3#U4#${filenames[3]}#SDXL#${interaction.id}`
                        ),
                        createButtonComponent(
                            "🔄",
                            `${interaction.id}#R1#retry`
                        ),
                    ]);

                    const row2 = new ActionRowBuilder().addComponents([
                        createButtonComponent(
                            "V1",
                            `${interaction.id}#V1#SDXL#${filenames[0]}`
                        ),
                        createButtonComponent(
                            "V2",
                            `${interaction.id}#V2#SDXL#${filenames[1]}`
                        ),
                        createButtonComponent(
                            "V3",
                            `${interaction.id}#V3#SDXL#${filenames[2]}`
                        ),
                        createButtonComponent(
                            "V4",
                            `${interaction.id}#V4#SDXL#${filenames[3]}`
                        ),
                        createButtonComponent(
                            "📷",
                            `${interaction.id}#C1#SDXL`
                        )
                    ]);

                    await interaction.editReply({
                        content: `** ${question} ** <@${interaction.user.id}>\n`,
                        files: [{
                                attachment: buffers[0],
                                name: filenames[0],
                                contentType: 'image/png',
                            },
                            {
                                attachment: buffers[1],
                                name: filenames[1],
                                contentType: 'image/png',
                            },
                            {
                                attachment: buffers[2],
                                name: filenames[2],
                                contentType: 'image/png',
                            },
                            {
                                attachment: buffers[3],
                                name: filenames[3],
                                contentType: 'image/png',
                            }

                        ],
                        components: [row1, row2]
                    });
                }

                await db
                    .collection("prompt-history")
                    .doc(interaction.id)
                    .set({
                        timeStamp: new Date(),
                        prompt: prompt,
                        question: question,
                        user: interaction.user.tag,
                        seed: seed,
                        width: width,
                        height: height,
                    });
                resolve(buffers);
            } catch (error) {
                reject(error);
            }
        });
    });
};

const queuePrompt = async (prompt) => {
    const response = await axios.post(`http://${server_address}/prompt`, {
        prompt,
        client_id
    });
    return response.data;
};

const getImage = async (filename, subfolder, folder_type) => {
    const response = await axios.get(`http://${server_address}/view`, {
        params: {
            filename,
            subfolder,
            type: folder_type
        },
        responseType: 'arraybuffer'
    });
    return response.data;
};

const getHistory = async (prompt_id) => {
    const response = await axios.get(`http://${server_address}/history/${prompt_id}`);
    return response.data;
};

const getImages = async (ws, prompt, interaction) => {
    let progress = 0;
    const {
        prompt_id
    } = await queuePrompt(prompt);
    let output_images = {};

    return new Promise((resolve) => {
        ws.on('message', async (data) => {
            let message;
            if (data instanceof Buffer) {
                message = JSON.parse(data.toString());
            } else if (typeof data === 'string') {
                message = JSON.parse(data);
            } else {
                console.warn('Unexpected WebSocket message format:', data);
                return;
            }
           if (message.type === 'progress') {
                if (message.data.max === 40) {
                    progress = 10 + message.data.value * 2;
                } else if (message.data.max === 30) {
                    progress = message.data.value * 3;
                } else {
                    progress = 0;
                }

                const progressBar =
                    "◻️".repeat(Math.round(progress / 10)) +
                    "◼️".repeat(10 - Math.round(progress / 10));

                await interaction.editReply(
                    `${progress}% ${progressBar} <@${interaction.user.id}>`
                );
            }
            if (message.type === 'executed') {
                const msgData = message.data;
                if (msgData.node && msgData.prompt_id === prompt_id) {
                    const history = await getHistory(prompt_id);
                    const outputs = history[prompt_id].outputs;
                    for (let node_id in outputs) {
                        const node_output = outputs[node_id];
                        if ('images' in node_output) {
                            let images_output = [];
                            for (let image of node_output.images) {
                                const image_data = await getImage(image.filename, image.subfolder, image.type);
                                images_output.push({
                                    data: image_data,
                                    filename: image.filename
                                });
                            }
                            output_images[node_id] = images_output;
                        }
                    }
                    resolve(output_images);
                }
            }
        });
    });
};

// Import Firebase Admin SDK Service Account Private Key
const firebaseServiceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString());

// Defines
const activity = '/dream or /help'

const commands = [{
        name: "imagine",
        description: "Generate an image",
        dm_permission: false,
        options: [{
                name: "idea",
                description: "Your idea",
                type: 3,
                required: true,
            },
            {
                name: "seed",
                description: "Seed Value (Random if not provided)",
                type: 3,
                required: false,
            },
            {
                name: "aspect",
                description: "Output image aspect ratio (1:1 if not provided)",
                type: 3,
                choices: aspectratios,
                required: false,
            },
        ],
    },
    {
        name: 'ping',
        description: 'Check Websocket Heartbeat && Roundtrip Latency'
    },
    {
        name: 'help',
        description: 'Get Help'
    }
];

// Initialize OpenAI Session
async function initOpenAI(messageStore) {
    if (process.env.API_ENDPOINT.toLocaleLowerCase() === 'default') {
        const api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_KEY,
            completionParams: {
                model: process.env.MODEL,
            },
            messageStore,
            debug: process.env.DEBUG
        });
        return api;
    } else {
        const api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_KEY,
            apiBaseUrl: process.env.API_ENDPOINT.toLocaleLowerCase(),
            completionParams: {
                model: process.env.MODEL,
            },
            messageStore,
            debug: process.env.DEBUG
        });
        return api;
    }
}

// Initialize Discord Application Commands & New ChatGPT Thread
async function initDiscordCommands() {
    const rest = new REST({
        version: '10'
    }).setToken(process.env.DISCORD_BOT_TOKEN);
    try {
        console.log('Started refreshing application commands (/)');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
            body: commands
        }).then(() => {
            console.log('Successfully reloaded application commands (/)');
        }).catch(e => console.log(chalk.red(e)));
        console.log('Connecting to Discord Gateway...');
    } catch (error) {
        console.log(chalk.red(error));
    }
}

function downloadImage(link, callback) {
    https.get(link, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const filePath = `/Users/alexg/ComfyUI/output/discord/${Date.now()}.jpg`; // Adjust the path and extension as needed
            fs.writeFile(filePath, buffer, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                    callback(null);
                } else {
                    callback(filePath);
                }
            });
        });
    }).on('error', (err) => {
        console.error('Error downloading the image:', err);
        callback(null);
    });
}

async function initFirebaseAdmin() {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseServiceAccount),
        databaseURL: `https://${firebaseServiceAccount.project_id}.firebaseio.com`
    });
    const db = admin.firestore();
    return db;
}

async function initKeyvFirestore() {
    const messageStore = new Keyv({
        store: new KeyvFirestore({
            projectId: firebaseServiceAccount.project_id,
            collection: 'messageStore',
            credentials: firebaseServiceAccount
        })
    });
    return messageStore;
}


const createButtonComponent = (
    label,
    customId,
    style = ButtonStyle.Secondary
) => {
    return new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style);
};

async function loadImageToBuffer(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        if (response.status === 200) {
            return Buffer.from(response.data);
        } else {
            throw new Error('Failed to fetch the image.');
        }
    } catch (error) {
        throw new Error('Failed to fetch the image: ' + error.message);
    }
}

// Main Function (Execution Starts From Here)
async function main() {
    if (process.env.UWU === 'true') {
        console.log(gradient.pastel.multiline(figlet.textSync('ChatGPT', {
            font: 'Univers',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 100,
            whitespaceBreak: true
        })));
    }

    const db = await initFirebaseAdmin();

    const messageStore = await initKeyvFirestore();

    const api = await initOpenAI(messageStore).catch(error => {
        console.error(error);
        process.exit();
    });

    await initDiscordCommands().catch(e => {
        console.log(e)
    });

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Message, Partials.Channel, Partials.Reaction]
    });

    console.log('Client created..');

    client.login(process.env.DISCORD_BOT_TOKEN).catch(e => console.log(chalk.red(e)));

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
        console.log(chalk.greenBright('Connected to Discord Gateway'));
        console.log(new Date())
        client.user.setStatus('online');
        client.user.setActivity(activity);
    });

    // Channel Message Handler
    client.on("interactionCreate", async interaction => {
        const channelCheck = process.env.CHANNEL_ID.includes(interaction.channel.id);
        if (!channelCheck) return;

        try {
            const {
                customId
            } = interaction;

            if (customId) {
                const buttonInfo = customId.split("#");

                if (buttonInfo[1].startsWith("U")) {
                    const doc = await db.collection('prompt-history').doc(buttonInfo[4]).get();
                    const prompt = doc.data().prompt; // response.text = response.text.replace(regex,"");
                    const question = doc.data().question;
                    const width = doc.data().width;
                    const height = doc.data().height;
                    const seed = doc.data().seed;
                    await interaction.reply(`Upscaling...🤔`);
                    const index = buttonInfo[0];
                    const attachmentsArray = Array.from(interaction.message.attachments.values());
                    const buffer = await loadImageToBuffer(attachmentsArray[index].attachment);

                    const row1 = new ActionRowBuilder().addComponents([
                        createButtonComponent(
                            "🪄 Variations",
                            `${interaction.id}#V1#SDXL#${buttonInfo[2]}`
                        ),
                        createButtonComponent(
                            "🪄 Hires Fix",
                            `${interaction.id}#H1#SDXL#${buttonInfo[2]}`
                        ),
                        createButtonComponent(
                            "📷",
                            `${interaction.id}#C1#SDXL#${buttonInfo[2]}`
                        )

                    ]);

                    await interaction.editReply({
                        content: `${interaction.message.content} (Upscaled) <@${interaction.user.id}>\n`,
                        files: [{
                            attachment: buffer,
                            name: buttonInfo[2],
                            contentType: 'image/png',
                        }],
                        components: [row1]
                    });

                    await db
                        .collection("prompt-history")
                        .doc(interaction.id)
                        .set({
                            timeStamp: new Date(),
                            prompt: prompt,
                            question: question,
                            width: width,
                            height: height,
                            seed: seed,
                            user: interaction.user.tag,

                        });
                } else if (buttonInfo[1].startsWith("V")) {
                    let progress = 0;
                    const progressBar =
                        "◻️".repeat(Math.round(progress / 10)) +
                        "◼️".repeat(10 - Math.round(progress / 10));

                    await interaction.reply(
                        `${progress}% ${progressBar} <@${interaction.user.id}>`
                    );

                    const doc = await db.collection('prompt-history').doc(buttonInfo[0]).get();

                    const prompt = doc.data().prompt;
                    const question = doc.data().question;
                    const width = doc.data().width;
                    const height = doc.data().height;
                    console.log(prompt);
                    const seed = (Math.random() * 2 ** 32 >>> 0); //.toString();
                    const prompt_text = img2img;

                    prompt_text["45"]["inputs"]["image"] = '/Users/alexg/ComfyUI/output/discord/' + buttonInfo[3];
                    queueImageGeneration(prompt_text, prompt, seed, width, height, interaction, question, db);

                } else if (buttonInfo[1].startsWith("C")) {

                    const doc = await db.collection('prompt-history').doc(buttonInfo[0]).get();
                    const prompt = doc.data().prompt; // response.text = response.text.replace(regex,"");
                    const seed = doc.data().seed;

                    console.log(prompt);
                    await interaction.reply(`**${prompt}**  *${seed}* <@${interaction.user.id}>\n`);

                } else if (buttonInfo[1].startsWith("H")) {

                    let progress = 0;
                    const progressBar =
                        "◻️".repeat(Math.round(progress / 10)) +
                        "◼️".repeat(10 - Math.round(progress / 10));

                    await interaction.reply(
                        `${progress}% ${progressBar} <@${interaction.user.id}>`
                    );

                    const doc = await db.collection('prompt-history').doc(buttonInfo[0]).get();
                    const prompt = doc.data().prompt; // response.text = response.text.replace(regex,"");
                    const question = doc.data().question;
                    const width = doc.data().width;
                    const height = doc.data().height;

                    console.log(prompt);

                    const seed = (Math.random() * 2 ** 32 >>> 0); //.toString();
                    const prompt_text = highresfix;

                    prompt_text["45"]["inputs"]["image"] = '/Users/alexg/ComfyUI/output/discord/' + buttonInfo[3];
                    queueImageGeneration(prompt_text, prompt, seed, width, height, interaction, question, db);

                } else {
                    imagine_Interaction_Handler(interaction);

                }

            }
        } catch (error) {
            console.log(error);
        }

        client.user.setActivity(interaction.user.tag, {
            type: ActivityType.Watching
        });
        if (!interaction.isChatInputCommand()) return;
        switch (interaction.commandName) {
            case "imagine":
                imagine_Interaction_Handler(interaction);
                break;
            case "ping":
                ping_Interaction_Handler(interaction);
                break;
            case "help":
                help_Interaction_Handler(interaction);
                break;
            default:
                await interaction.reply({
                    content: 'Command Not Found'
                });
        }
    });

    async function imagine_Interaction_Handler(interaction) {

        let question, height, width;
        let seed = (Math.random() * 2 ** 32 >>> 0); //.toString();
        if (interaction.options) {
            question = interaction.options.getString("idea") ?? "random cool image";

              if (interaction.options.getString("aspect") === '2') {
                height = 896;
                width = 1152;
              } else if (interaction.options.getString("aspect") === '3') {
                height = 1152;
                width = 896;
              } else if (interaction.options.getString("aspect") === '4') {
                height = 832;
                width = 1216;
              } else if (interaction.options.getString("aspect") === '5') {
                height = 1216;
                width = 832;
              } else if (interaction.options.getString("aspect") === '6') {
                height = 768;
                width = 1344;
              } else if (interaction.options.getString("aspect") === '7') {
                height = 1344;
                width = 768;
              } else if (interaction.options.getString("aspect") === '8') {
                height = 640;
                width = 1536;
              } else if (interaction.options.getString("aspect") === '9') {
                height = 1536;
                width = 640;
              } else {
                height = 1024;
                width = 1024;
              }

            if (interaction.options.getString("seed")) {
                seed = +interaction.options.getString("seed");
            }

        }
        console.log("----------Channel Message--------");
        console.log("Date & Time : " + new Date());
        console.log("UserId      : " + interaction.user.id);
        console.log("User        : " + interaction.user.tag);
        console.log("Question    : " + question);

        try {
            const {
                customId,
            } = interaction;
            if (customId) {
                const buttonInfo = customId.split("#");
                const doc = await db.collection('prompt-history').doc(buttonInfo[0]).get();
                height = doc.data().height;
                width = doc.data().width;
                question = doc.data().question;
            }
            await interaction.reply({
                content: `Processing your request...`
            });

            const customPrompt = process.env.EXTRA_SKILL;
            const systemPrompt = process.env.SYSTEM_MESSAGE;

            var content = {};
            let image2image = false;
            let link;

            if (question.startsWith('https://')) {
                let linkEndIndex = question.indexOf(' ');

                // if there is no space in the string, then the link is the entire string
                if (linkEndIndex === -1) {
                    linkEndIndex = question.length;
                }

                link = question.substring(0, linkEndIndex);
                image2image = true;
                console.log(link); // Outputs: "https://example.com"
                question = question.replace(link, '');
            }
            if (!question.startsWith(':')) {
                content = await api.sendMessage(customPrompt + '\n' + question, {
                    systemMessage: systemPrompt + customPrompt
                });

            } else {

                content.text = question.replace(':', '');
                question = question.replace(':', '');

            }
            if (!content.text) {
                await interaction.editReply(
                    `**${interaction.user.tag}:** ${question}\n**${client.user.username}:** API Error ❌\n\`\`\`\n${content}\n\`\`\`\n</>`
                );

                client.user.setActivity(activity);
                return;
            }

            console.log("Response    : " + content.text);
            console.log("---------------End---------------");
            if (content.text) {

                try {
                    let progress = 0;
                    const progressBar =
                        "◻️".repeat(Math.round(progress / 10)) +
                        "◼️".repeat(10 - Math.round(progress / 10));

                    await interaction.editReply(
                        `${progress}% ${progressBar} <@${interaction.user.id}>`
                    );

                    let prompt;
                    if (content.text.includes('![IMAGE][')) {
                        const regex = /!\[IMAGE\]\[(.*?(?=\]|\>>|\)))]/;
                        //(beautiful photo, masterpiece),' + 
                        prompt = '(masterpiece,best quality, ultra realistic,32k,RAW photo,detailed skin, 8k uhd, high quality:1.2),' + content.text.match(regex)[1];
                    } else {
                        prompt = question;
                    }
                    console.log(prompt);

                    if (image2image) {
                        // We assume 'link' is already defined as you mentioned in the comments
                        downloadImage(link, (savedImagePath) => {
                            if (savedImagePath) {
                                const prompt_text = img2img;
                                prompt_text["45"]["inputs"]["image"] = savedImagePath;
                                queueImageGeneration(prompt_text, prompt, seed, width, height, interaction, question, db);
                            } else {
                                console.error('Failed to download and save the image.');
                            }
                        });
                    } else {

                        queueImageGeneration(txt2img, prompt, seed, width, height, interaction, question, db);
                    }

                } catch (error) {
                    console.log(error);
                }
            } else {
                await interaction.editReply(
                    `**${interaction.user.tag}:** ${question}\n**${client.user.username}:** **${content.text}**\n`
                );
            }
            client.user.setActivity(activity);


        } catch (e) {
            console.error(chalk.red(e));
        }
    }
}

async function ping_Interaction_Handler(interaction) {
    const sent = await interaction.reply({
        content: 'Pinging...🌐',
        fetchReply: true
    });
    await interaction.editReply(`Websocket Heartbeat: ${interaction.client.ws.ping} ms. \nRoundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp} ms\n`);
    client.user.setActivity(activity);
}

async function help_Interaction_Handler(interaction) {
    await interaction.reply("**Singularity AI**\nA Discord AI Bot Powered by Bitcoin Ordinals!\n\n**Usage:**\nDM - Tag or metion\n`/reset-chat` - Start A Fresh Chat Session\n`/ping` - Check Websocket Heartbeat && Roundtrip Latency\n\nSupport Server: https://discord.gg/btcai");
    client.user.setActivity(activity);
}

// Discord Rate Limit Check
setInterval(() => {
    axios
        .get('https://discord.com/api/v10')
        .catch(error => {
            if (error.response && error.response.status === 429) {
                console.log("Discord Rate Limited");
                console.warn("Status: " + error.response.status);
                console.warn(error);
            }
        });

}, 30000); // Check Every 30 Second

main()