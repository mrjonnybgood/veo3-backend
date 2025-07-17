const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Veo3 Backend is running!' });
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
              text: `Analyze this image for video generation prompts. Return a JSON object with these exact fields:

{
  "style": "realistic/animation/anime/claymation/artistic",
  "subject": {
    "description": "detailed description of people/characters including appearance, age, expression, pose",
    "wardrobe": "clothing, accessories, makeup details"
  },
  "scene": {
    "location": "specific location/setting description", 
    "time_of_day": "dawn/morning/afternoon/sunset/twilight/night",
    "environment": "environmental details, atmosphere, background elements"
  },
  "visual_details": {
    "action": "what the subject is doing, movements, gestures",
    "props": "objects, furniture, items in the scene"
  },
  "cinematography": {
    "lighting": "lighting conditions, mood, shadows, highlights",
    "tone": "emotional tone, mood, atmosphere"
  },
  "color_palette": "dominant colors and overall color scheme"
}

Be very specific and descriptive. Focus on details that would help recreate this scene in video generation.`
            },
            {
              type: "image_url",
              image_url: { url: image }
            }
          ]
        }],
        max_tokens: 1500,
        temperature: 0.7
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
  console.log(`Server running on port ${PORT}`);
});
