<h1 align="center">
Dreamshaper - Stable Diffusion XL Discord midjourney style bot powered by ChatGPT, SDXL and ComfyUI
</h1>


<p align="center">
<img src="img/ChatGPT.svg">
</p>




</p>




A Stable Diffusion XL Discord BOT Powered By [OpenAI](https://openai.com/)'s [ChatGPT](https://chat.openai.com).


This BOT uses [ChatGPT API](https://github.com/transitive-bullshit/chatgpt-api) & [Firebase](https://firebase.google.com/) [Firestore Database](https://firebase.google.com/docs/firestore) & [ComfyUI](https://github.com/comnfyui).


## ✨Features
🔥 Use slash command `/dream` to create images in the specified channel.


💥 Uses Firestore Database for persistent prompt history storage & logs.


💫 Easy Setup !
## 🥏 Usage:


- `/dream` - image prompt.
- `/help` - Get Help.


- `/ping` - Check Websocket Heartbeat && Roundtrip Latency.




## 📡 Quick Start [Self-Hosting] :
### 0. Requirements:
- [Git](https://git-scm.com/)
- [Node.js v18](https://nodejs.org/)
- [OpenAI Account](https://chat.openai.com/)
- [Discord Account](https://discord.com/)
- [Google Account](https://accounts.google.com/) For [Firebase](https://firebase.google.com/)
- an Nvidia GPU to run SDXL on ComfyUI


### 1. Bot Setup:
0. Create **New Application** (BOT) from [Discord Developer Portal](https://discord.com/developers/applications) and invite that bot to your Discord Server with:<br>
**Scopes:** `bot` & `application.commands` <br>
**Bot Permissions:** `2734284602433` <br>
**Privileged Gateway Intents:** `PRESENCE`, `SERVER MEMBERS`, `MESSAGE CONTENT` <br>
- **Example Bot Invite URL** (Replace `BOT_CLIENT_ID` with your bot's Client ID) **:**
```
https://discord.com/api/oauth2/authorize?client_id=BOT_CLIENT_ID&permissions=2734284602433&scope=bot%20applications.commands
```
1. `⭐Star` this Repo to get updates.


2. Clone this repo:
```bash
git clone https://github.com/cryptaralex/dreamshaper
```
Then navigate to the folder:
```bash
cd ChatGPT-Discord-BOT
```


3. Install all dependencies:
```bash
npm install
```


4. To setup Environment Variables, Copy & Rename the `.env.example` file to `.env` <br> Then, fill the credentials.


5. Setup Firebase Firestore Database by following [this instruction](https://github.com/crptaralex/dreamshaper/#-database-setup).


6. Start the BOT:
```bash
npm run start
```
*Or,* During Development:
```bash
npm run dev
```
*Or,* In Production:
```bash
npm run prod
```


7. Use the BOT 🎉


### • Environment Variables Setup:


- `DISCORD_CLIENT_ID` - Client ID of the bot from *OAuth2* section.


- `DISCORD_BOT_TOKEN` - Token of the bot from *Bot* section.


- `OPENAI_API_KEY` - Get OpenAI API Key from [here](https://platform.openai.com/account/api-keys).


#### **• Advanced Settings:**


- `DISCORD_MAX_RESPONSE_LENGTH` - Max *2000* , recomended *1900*.


- `API_ENDPOINT` - Set `default` for *api.openai.com* endpoint. But you can set 3rd party equivalent endpoint too.


- `DEBUG` - Toggle Debug Messages. **Values:** `true` or `false`


- `UWU` - Toggle Figlet & Gradient-String decoration. **Values:** `true` or `false`


- `MODEL` - Name of the Model you want to use. Like, `text-davinci-003` , `gpt-3.5-turbo` , `gpt-4` etc.


- `SYSTEM_MESSAGE` - This is the Initial Prompt that is sent to the Model. You can change it to anything you want to change the bot's behaviour as your requirements. Knowledge Cutoff and Current Date is always sent.


> See [.env.example](https://github.com/cryptaralex/dreamshaper/blob/main/.env.example) file for more details


### • Database Setup:


0. Goto **Firebase Console:** [console.firebase.google.com](https://console.firebase.google.com/) (No Card Required)


1. Click on `Create a project` or `Add project`. Give it a name and click `Continue`


2. Disable Google Analytics & Click `Create Project`


3. From the side-bar goto `Build` & then `Firestore Database`.


4. Click `Create Database`


5. Select `Start in production mode` & click `Next`


6. Select a Firestore location nearest to your Server / VPS. This'll also set the Default GCP Resource Location & you can't change it later. <br> Then click `Enable`


7. Now goto `Project settings` & `Service accounts`.


8. Under `Firebase Admin SDK` select `Node.js`. Then click `Generate new private key` and then click `Generate key`


9. **Important:** Rename the downloaded json file to `firebaseServiceAccountKey.json` <br> Any other name will not work here. Then put the json file in your bots directory. <br>Copy FileName:
```bash
firebaseServiceAccountKey.json  <-- You need to base64 this and put it into the .env file now
```


> ✨ Tip: check out these images [here](https://github.com/cryptaralex/dreamshaper/tree/main/img)


## 💬 Support:

- [Create Issue](https://github.com/cryptaralex/dreamshaper/issues/new)


## ⛓ Others:
#### 📝 License: [MIT](https://github.com/mypath/blob/main/LICENSE)
#### 🔋 ChatGPT API: [transitive-bullshit/chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)
#### 📚 Database: [Firestore](https://firebase.google.com/docs/firestore)
#### 🌐 BaaS: [Firebase](https://firebase.google.com/)


<br>
<p align='center'>
--- 🙂 ---
</p>



