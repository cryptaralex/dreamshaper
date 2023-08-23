const highresfix = 
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
      "text_g": "(masterpiece), (extremely intricate:1.3), (realistic), (photorealistic:1.4), an astronaut riding a horse on the moon",
      "text_l": "(masterpiece), (extremely intricate:1.3), (realistic), (photorealistic:1.4), an astronaut riding a horse on the moon",
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
      "steps": 30,
      "cfg": 7.5,
      "sampler_name": "dpmpp_2m_sde_gpu",
      "scheduler": "karras",
      "start_at_step": 0,
      "end_at_step": 30,
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
        "8",
        0
      ]
    },
    "class_type": "KSamplerAdvanced"
  },
  "7": {
    "inputs": {
      "text": "bad quality, butterface, extra legs, crossed fingers, too many fingers, open mouth, teeth, long neck, watermark, signature",
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
        "67",
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
      "switch": "Off",
      "lora_name": "topless v1a_fro0.95.safetensors",
      "strength_model": 1,
      "strength_clip": 1,
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
  "46": {
    "inputs": {
      "pixels": [
        "66",
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
        "75",
        0
      ]
    },
    "class_type": "RepeatLatentBatch"
  },
  "58": {
    "inputs": {
      "output_path": "discord",
      "filename_prefix": "sdxl_hires",
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
        "89",
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
        "84",
        0
      ]
    },
    "class_type": "CR Seed to Int"
  },
  "74": {
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
        "94",
        0
      ]
    },
    "class_type": "ImageScale"
  },
  "75": {
    "inputs": {
      "pixels": [
        "74",
        0
      ],
      "vae": [
        "1",
        2
      ]
    },
    "class_type": "VAEEncode"
  },
  "84": {
    "inputs": {
      "seed": 1079942137815944
    },
    "class_type": "Seed (Legacy)"
  },
  "86": {
    "inputs": {
      "gap": 0,
      "max_columns": 2,
      "images": [
        "28",
        0
      ]
    },
    "class_type": "ImagesGridByColumns"
  },
  "89": {
    "inputs": {
      "url": "http://127.0.0.1:8188/view?filename=sdxl_1071.png&subfolder=discord&type=output",
      "keep_alpha_channel": false
    },
    "class_type": "LoadImageFromUrl"
  },
  "94": {
    "inputs": {
      "top": 0,
      "left": 0,
      "right": 1024,
      "bottom": 1024,
      "image": [
        "89",
        0
      ]
    },
    "class_type": "Image Crop Location"
  }
};
  export default highresfix;  