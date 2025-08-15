# Yoga Escrow API

Backend API service for the Yoga Escrow platform, providing Instagram profile scraping and image proxying capabilities.

## Overview

This Express.js API serves as a secure backend layer that:
- Fetches yoga teacher profiles from Instagram using Apify
- Proxies Instagram images to bypass CORS restrictions
- Transforms Instagram data into a standardized format for frontend consumption

## Setup

### Prerequisites
- Node.js 18+ or Bun
- Apify account and API token

### Installation

```bash
# From the monorepo root
bun install

# Or from this directory
cd apps/api
bun install
```

### Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Add your Apify API token:
```env
APIFY_TOKEN=your_actual_apify_token_here
PORT=3001
```

3. Get your Apify token from: https://console.apify.com/account/integrations

### Running the API

```bash
# Development mode with hot reload
bun run dev

# Production build
bun run build
bun run start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-15T08:44:29.199Z"
}
```

### Fetch Instagram Teachers
```
GET /api/teachers/instagram
GET /api/teachers/instagram?handles=yoginastya,vi_zahvatova
```

Fetches Instagram profiles for yoga teachers. Uses default handles if none specified.

**Query Parameters:**
- `handles` (optional): Comma-separated list of Instagram usernames

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": "2257964708",
      "handle": "yoginastya",
      "displayName": "ANASTASIA MALOVA - YOGA IN TBILISI & ONLINE",
      "heroImage": "http://localhost:3001/api/proxy/image?url=...",
      "gridImages": [
        "http://localhost:3001/api/proxy/image?url=...",
        "http://localhost:3001/api/proxy/image?url=...",
        "http://localhost:3001/api/proxy/image?url=..."
      ],
      "stats": {
        "followers": "1.3K",
        "sessions": 750,
        "rating": 4.7
      },
      "tags": ["Vinyasa", "Flow", "Yoga"],
      "vibe": "Yoga teacher sharing the journey",
      "verified": false
    }
  ],
  "handles": ["yoginastya", "vi_zahvatova"],
  "timestamp": "2025-08-15T08:44:29.199Z",
  "mock": false
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch Instagram profiles",
  "message": "Detailed error message"
}
```

### Scrape Custom Profiles
```
POST /api/teachers/instagram/scrape
Content-Type: application/json

{
  "handles": ["yoginastya", "custom_teacher_handle"]
}
```

Scrapes specific Instagram profiles on demand.

**Request Body:**
- `handles` (required): Array of Instagram usernames to scrape

**Response:** Same structure as GET endpoint

### Image Proxy
```
GET /api/proxy/image?url=https://instagram.com/image.jpg
```

Proxies Instagram images to bypass CORS restrictions. All image URLs returned from the Instagram endpoints are already proxied through this endpoint.

**Query Parameters:**
- `url` (required): URL-encoded Instagram image URL

**Response:** Binary image data with appropriate content-type header

## Frontend Integration Guide

### Basic Fetch Example

```javascript
// Fetch yoga teachers with default handles
async function fetchYogaTeachers() {
  try {
    const response = await fetch('http://localhost:3001/api/teachers/instagram');
    const data = await response.json();
    
    if (data.success) {
      return data.data; // Array of teacher profiles
    } else {
      console.error('API Error:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Network error:', error);
    return [];
  }
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface TeacherProfile {
  id: string;
  handle: string;
  displayName: string;
  heroImage: string;
  gridImages: string[];
  stats: {
    followers: string;
    sessions: number;
    rating: number;
  };
  tags: string[];
  vibe: string;
  verified: boolean;
}

export function useInstagramTeachers(handles?: string[]) {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        setLoading(true);
        setError(null);
        
        const url = new URL('http://localhost:3001/api/teachers/instagram');
        if (handles?.length) {
          url.searchParams.append('handles', handles.join(','));
        }
        
        const response = await fetch(url.toString());
        const data = await response.json();
        
        if (data.success) {
          setTeachers(data.data);
        } else {
          setError(data.error || 'Failed to fetch teachers');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTeachers();
  }, [handles?.join(',')]);
  
  return { teachers, loading, error };
}
```

### Displaying Images

All image URLs returned by the API are already proxied through our server, so they can be used directly in img tags without CORS issues:

```jsx
function TeacherCard({ teacher }) {
  return (
    <div>
      <img 
        src={teacher.heroImage} 
        alt={teacher.displayName}
        // Images are cached by our proxy for 24 hours
      />
      <h3>{teacher.displayName}</h3>
      <p>@{teacher.handle}</p>
      <p>{teacher.stats.followers} followers</p>
      
      <div className="grid">
        {teacher.gridImages.map((img, i) => (
          <img key={i} src={img} alt={`Post ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
```

## Architecture Notes

### Why Image Proxying?

Instagram's CDN sets CORS headers that prevent direct image embedding on third-party websites. Our proxy endpoint:
1. Fetches images server-side (no CORS restrictions)
2. Serves them with permissive CORS headers
3. Caches images for 24 hours to reduce load
4. Ensures consistent image availability

### Mock Data Fallback

When no Apify token is configured, the API returns mock data with placeholder images from Picsum. This allows frontend development without Instagram API access.

### Data Transformation

The API transforms raw Instagram data into a standardized format:
- Formats follower counts (1.3K, 2.5M)
- Extracts yoga-related tags from bios
- Generates placeholder stats (sessions, ratings) 
- Proxies all image URLs automatically

## Error Handling

The API provides detailed error messages for debugging:

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Invalid request | Missing or invalid parameters |
| 401 | Authentication failed | Invalid or missing Apify token |
| 500 | Server error | Instagram scraping failed or internal error |

## Development Tips

1. **Testing without Apify**: The API returns mock data when `APIFY_TOKEN` is not set or is the placeholder value
2. **CORS Issues**: All images are automatically proxied - never use Instagram URLs directly
3. **Rate Limiting**: Apify has usage limits - cache responses in your frontend when possible
4. **Error Recovery**: Always implement retry logic for network failures

## Security Considerations

- Never expose the Apify token to the frontend
- The API token should only be stored in environment variables
- Consider implementing rate limiting for production use
- Add authentication if exposing to public internet