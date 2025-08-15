import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createInstagramScraper, DEFAULT_YOGA_HANDLES } from './services/instagram-scraper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/teachers/instagram', async (req, res) => {
  try {
    const handles = req.query.handles 
      ? (req.query.handles as string).split(',') 
      : DEFAULT_YOGA_HANDLES;

    const apifyToken = process.env.APIFY_TOKEN;
    
    // Check if token is actually set (not the placeholder)
    if (!apifyToken || apifyToken === 'your_apify_token_here') {
      console.log('Using mock data - Apify token not configured');
      // Return mock data for development
      const mockTeachers = handles.map((handle, index) => ({
        id: `mock_${handle}`,
        handle: handle,
        displayName: handle.charAt(0).toUpperCase() + handle.slice(1).replace(/_/g, ' '),
        heroImage: `https://picsum.photos/seed/${handle}/400/400`,
        gridImages: [
          `https://picsum.photos/seed/${handle}1/300/300`,
          `https://picsum.photos/seed/${handle}2/300/300`,
          `https://picsum.photos/seed/${handle}3/300/300`
        ],
        stats: {
          followers: `${Math.floor(Math.random() * 50 + 10)}K`,
          sessions: Math.floor(Math.random() * 500 + 100),
          rating: 4.5 + Math.random() * 0.5
        },
        tags: ['Vinyasa', 'Flow', 'Meditation'],
        vibe: 'Yoga teacher sharing the journey 🧘‍♀️',
        verified: Math.random() > 0.5
      }));
      
      return res.json({ 
        success: true,
        data: mockTeachers,
        handles: handles,
        timestamp: new Date().toISOString(),
        mock: true
      });
    }

    const scraper = createInstagramScraper(apifyToken);
    const teachers = await scraper.scrapeProfiles(handles);
    
    res.json({ 
      success: true,
      data: teachers,
      handles: handles,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching Instagram profiles:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch Instagram profiles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/teachers/instagram/scrape', async (req, res) => {
  try {
    const { handles } = req.body;
    
    if (!handles || !Array.isArray(handles) || handles.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request: handles array is required' 
      });
    }

    const apifyToken = process.env.APIFY_TOKEN;
    if (!apifyToken) {
      return res.status(500).json({ 
        error: 'Server configuration error: Apify token not configured' 
      });
    }

    const scraper = createInstagramScraper(apifyToken);
    const teachers = await scraper.scrapeProfiles(handles);
    
    res.json({ 
      success: true,
      data: teachers,
      handles: handles,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error scraping Instagram profiles:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to scrape Instagram profiles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Image proxy endpoint to bypass CORS
app.get('/api/proxy/image', async (req, res) => {
  try {
    const imageUrl = req.query.url as string;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Fetch the image from Instagram
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    
    // Set cache headers for performance
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      'Access-Control-Allow-Origin': '*'
    });
    
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Instagram teachers endpoint: http://localhost:${PORT}/api/teachers/instagram`);
  console.log(`Image proxy endpoint: http://localhost:${PORT}/api/proxy/image?url=IMAGE_URL`);
});