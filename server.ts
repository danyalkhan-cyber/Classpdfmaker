import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

// High payload limit for image data URLs
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Allow open public access and preflight requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static assets from public folder (including ads.txt, logo, worker)
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

// Public health check endpoint for Cloud Run monitoring
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    publicAccess: true,
    service: 'ClassPDF Maker',
    mode: 'in-browser-pdf-compiler',
    timestamp: new Date().toISOString(),
  });
});

// Initialize GoogleGenAI server-side with environment key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Endpoint 1: Generate video from text using gemini-omni-1.1-flash
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9', duration = '5s' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please add your Gemini API key in Secrets.',
      });
    }

    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.1-flash',
        input: prompt,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
          duration: duration === '10s' ? '10s' : '5s',
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const mimeType = videoPart.mime_type || 'video/mp4';
      const videoDataUrl = `data:${mimeType};base64,${videoPart.data}`;
      return res.json({ videoUrl: videoDataUrl, mimeType });
    }

    return res.status(500).json({ error: 'No video output returned by the model.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Video generation failed';
    console.error('Video generation error:', message);
    return res.status(500).json({ error: message });
  }
});

// Endpoint 2: Animate uploaded image into video using gemini-omni-1.1-flash
app.post('/api/animate-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', prompt, aspectRatio = '16:9' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please add your Gemini API key in Secrets.',
      });
    }

    // Clean base64 header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const motionPrompt =
      prompt ||
      'Cinematic smooth camera pan across this handwritten academic document, bringing equations and notes into sharp vivid clarity.';

    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.1-flash',
        input: [
          {
            type: 'image',
            mime_type: mimeType,
            data: cleanBase64,
          },
          {
            type: 'text',
            text: motionPrompt,
          },
        ],
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const outputMime = videoPart.mime_type || 'video/mp4';
      const videoDataUrl = `data:${outputMime};base64,${videoPart.data}`;
      return res.json({ videoUrl: videoDataUrl, mimeType: outputMime });
    }

    return res.status(500).json({ error: 'No video output returned by the model.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Image animation failed';
    console.error('Image animation error:', message);
    return res.status(500).json({ error: message });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ClassPDF Maker server running on http://0.0.0.0:${port}`);
  });
}

startServer();
