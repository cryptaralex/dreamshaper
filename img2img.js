 const img2img = 
 {
    "1": {
      "inputs": {
        "ckpt_name": "dreamshaperXL10_alpha2Xl10.safetensors"
      },
      "class_type": "CheckpointLoaderSimple"
    },
    "2": {
      "inputs": {
        "width": 4096,
        "height": 4096,
        "crop_w": 0,
        "crop_h": 0,
        "target_width": 4096,
        "target_height": 4096,
        "text_g": "(masterpiece,high quality:1.2)(fantasy 1.2) 1 girl, white hair, small breasts , blue eyes, cyborg, giger, wires, mechanical ribs, inner blue glow, working in the laboratory (intricate details), (hyperdetailed), 8k hdr, high detailed, lot of details, high quality, (colored)",
        "text_l": "Photographic",
        "clip": [
          "25",
          1
        ]
      },
      "class_type": "CLIPTextEncodeSDXL"
    },
    "4": {
      "inputs": {
        "add_noise": "enable",
        "noise_seed": [
          "68",
          0
        ],
        "steps": 40,
        "cfg": 5,
        "sampler_name": "dpmpp_2m_sde_gpu",
        "scheduler": "karras",
        "start_at_step": 0,
        "end_at_step": 40,
        "return_with_leftover_noise": "disable",
        "model": [
          "25",
          0
        ],
        "positive": [
          "2",
          0
        ],
        "negative": [
          "7",
          0
        ],
        "latent_image": [
          "51",
          0
        ]
      },
      "class_type": "KSamplerAdvanced"
    },
    "7": {
      "inputs": {
        "text": "bad quality, butterface, extra legs, crossed fingers, too many fingers, teeth, long neck, watermark, signature",
        "clip": [
          "25",
          1
        ]
      },
      "class_type": "CLIPTextEncode"
    },
    "8": {
      "inputs": {
        "width": [
          "41",
          0
        ],
        "height": [
          "41",
          1
        ],
        "batch_size": 4
      },
      "class_type": "EmptyLatentImage"
    },
    "25": {
      "inputs": {
        "lora_name": "sd_xl_offset_example-lora_1.0.safetensors",
        "strength_model": 0.75,
        "strength_clip": 1,
        "model": [
          "37",
          0
        ],
        "clip": [
          "37",
          1
        ]
      },
      "class_type": "LoraLoader"
    },
    "28": {
      "inputs": {
        "samples": [
          "4",
          0
        ],
        "vae": [
          "1",
          2
        ]
      },
      "class_type": "VAEDecode"
    },
    "37": {
      "inputs": {
        "switch": "On",
        "lora_name": "topless v1a_fro0.95.safetensors",
        "strength_model": 0.49999999999999956,
        "strength_clip": 0.5,
        "model": [
          "1",
          0
        ],
        "clip": [
          "1",
          1
        ]
      },
      "class_type": "CR Load LoRA"
    },
    "41": {
      "inputs": {
        "width": 1024,
        "height": 1024,
        "upscale_factor": 1
      },
      "class_type": "CR Image Size"
    },
    "45": {
      "inputs": {
        "image": "sdxl_0018.png",
        "choose file to upload": "image"
      },
      "class_type": "LoadImage"
    },
    "46": {
      "inputs": {
        "pixels": [
          "70",
          0
        ],
        "vae": [
          "1",
          2
        ]
      },
      "class_type": "VAEEncode"
    },
    "51": {
      "inputs": {
        "amount": 4,
        "samples": [
          "46",
          0
        ]
      },
      "class_type": "RepeatLatentBatch"
    },
    "58": {
      "inputs": {
        "output_path": "discord",
        "filename_prefix": "sdxl",
        "filename_delimiter": "_",
        "filename_number_padding": 4,
        "filename_number_start": "false",
        "extension": "png",
        "quality": 100,
        "lossless_webp": "false",
        "overwrite_mode": "false",
        "show_history": "false",
        "show_history_by_prefix": "true",
        "embed_workflow": "true",
        "show_previews": "true",
        "images": [
          "28",
          0
        ]
      },
      "class_type": "Image Save"
    },
    "64": {
      "inputs": {
        "model_name": "realesr-general-x4v3.pth"
      },
      "class_type": "UpscaleModelLoader"
    },
    "65": {
      "inputs": {
        "upscale_model": [
          "64",
          0
        ],
        "image": [
          "45",
          0
        ]
      },
      "class_type": "ImageUpscaleWithModel"
    },
    "66": {
      "inputs": {
        "upscale_method": "nearest-exact",
        "scale_by": 0.375,
        "image": [
          "65",
          0
        ]
      },
      "class_type": "ImageScaleBy"
    },
    "67": {
      "inputs": {
        "seed": [
          "68",
          0
        ],
        "steps": 30,
        "cfg": 8,
        "sampler_name": "dpmpp_2s_ancestral",
        "scheduler": "normal",
        "denoise": 0.6,
        "model": [
          "25",
          0
        ],
        "positive": [
          "2",
          0
        ],
        "negative": [
          "7",
          0
        ],
        "latent_image": [
          "46",
          0
        ]
      },
      "class_type": "KSampler"
    },
    "68": {
      "inputs": {
        "seed": [
          "69",
          0
        ]
      },
      "class_type": "CR Seed to Int"
    },
    "69": {
      "inputs": {
        "seed": 804592116214170
      },
      "class_type": "Seed"
    },
    "70": {
      "inputs": {
        "upscale_method": "nearest-exact",
        "width": [
          "41",
          0
        ],
        "height": [
          "41",
          1
        ],
        "crop": "disabled",
        "image": [
          "45",
          0
        ]
      },
      "class_type": "ImageScale"
    }
  };  
        export default img2img;
 