const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Veo3 Enhanced Backend is running!' });
});

app.post('/analyze-image', async (req, res) => {
  try {
    const { image, apiKey } = req.body;

    if (!apiKey || !image) {
      return res.status(400).json({ error: 'Missing API key or image' });
    }

    // Use dynamic import for fetch (Node.js 18+)
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a professional film and animation director analyzing this image for precise video recreation. Provide an extremely detailed analysis in JSON format with these exact fields:

{
  "style": {
    "visual_style": "realistic/animation/anime/claymation/stop-motion/CGI",
    "animation_studio": "Pixar/Disney/Studio Ghibli/DreamWorks/Laika/etc or N/A if realistic",
    "art_direction": "photorealistic/cel-shaded/hand-drawn/3D rendered/mixed media",
    "reference_films": "films or shows this resembles visually",
    "texture_details": "surface textures, material properties, rendering style"
  },
  "camera": {
    "shot_type": "extreme close-up/close-up/medium shot/medium close-up/long shot/extreme long shot",
    "camera_angle": "eye level/high angle/low angle/bird's eye/worm's eye/dutch angle",
    "lens_focal_length": "14mm/24mm/35mm/50mm/85mm/135mm/200mm (estimate based on perspective)",
    "aperture": "f/1.4/f/2.8/f/4/f/5.6/f/8 (estimate based on depth of field)",
    "depth_of_field": "shallow/moderate/deep - describe what's in focus vs blurred",
    "camera_movement": "static/pan left/pan right/tilt up/tilt down/dolly in/dolly out/handheld/steadicam",
    "composition_rules": "rule of thirds/center composition/leading lines/symmetry/golden ratio",
    "framing": "tight/loose/headroom details/lead room for movement"
  },
  "characters": [
    {
      "character_id": "character_1/character_2/etc",
      "description": "detailed physical appearance, age, gender, expression, pose",
      "position": "left/center/right/foreground/background",
      "wardrobe": "detailed clothing, accessories, colors, style",
      "actions": "specific movements, gestures, what they're doing",
      "eye_contact": "looking at camera/looking at other character/looking off-screen",
      "dialogue_attribution": "likely speaker for any dialogue - yes/no and confidence level"
    }
  ],
  "scene": {
    "location": "specific location with architectural/environmental details",
    "time_of_day": "dawn/morning/afternoon/sunset/twilight/night with specific time if apparent",
    "weather": "clear/cloudy/rainy/snowy/foggy/stormy",
    "season": "spring/summer/fall/winter based on visual cues",
    "environment_details": "textures, materials, architectural style, natural elements",
    "background_elements": "detailed description of everything visible in background",
    "foreground_elements": "objects in immediate foreground",
    "set_design": "practical/digital/mixed - production design notes"
  },
  "lighting": {
    "primary_light_source": "natural sunlight/window light/artificial/mixed",
    "lighting_direction": "front lit/side lit/back lit/top lit/bottom lit",
    "lighting_quality": "hard/soft/diffused/dramatic/even",
    "shadows": "deep/soft/minimal/dramatic with direction",
    "color_temperature": "warm (3200K)/daylight (5600K)/cool (7000K+)",
    "lighting_setup": "key light/fill light/rim light/background light details",
    "mood": "bright and cheerful/moody and dramatic/neutral/romantic/ominous"
  },
  "color": {
    "color_palette": "dominant colors with specific names (crimson, azure, etc.)",
    "color_grading": "warm/cool/neutral/teal and orange/vintage/modern",
    "saturation": "highly saturated/moderately saturated/desaturated/black and white",
    "contrast": "high contrast/low contrast/medium contrast",
    "color_story": "how colors support the mood and narrative"
  },
  "audio_design": {
    "dialogue": [
      {
        "speaker": "character_1/character_2/narrator/off-screen voice",
        "estimated_line": "best guess at what might be said based on scene context",
        "delivery_style": "conversational/dramatic/whispered/shouted/emotional tone",
        "timing": "beginning/middle/end of scene or throughout"
      }
    ],
    "music_style": "orchestral/electronic/acoustic/jazz/rock/ambient with specific mood",
    "sound_effects": "environmental sounds, foley effects needed",
    "ambient_audio": "background sounds, room tone, atmosphere"
  },
  "technical_notes": {
    "aspect_ratio": "16:9/4:3/21:9/1:1 (estimate from image proportions)",
    "resolution_feel": "film grain/digital clean/vintage/modern",
    "post_processing": "color correction, visual effects, filters applied",
    "production_value": "high budget/medium budget/low budget/amateur/professional assessment"
  }
}

Analyze every detail visible in the image. Be extremely specific and technical. This analysis will be used to recreate this exact scene in video form, so precision is critical. Focus on what you can actually see, but make educated professional assessments for technical details like lens focal length and aperture based on the visual characteristics.`
            },
            {
              type: "image_url",
              image_url: { url: image }
            }
          ]
        }],
        max_tokens: 3000,
        temperature: 0.3
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return res.status(response.status).json(data);
    }
    
    res.json(data);

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      type: error.name 
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Veo3 Enhanced Backend running on port ${PORT}`);
});
