import { SpotifyTrack } from '@/types/types';
import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: Request) {
  try {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return NextResponse.json({ 
        error: 'Spotify API credentials not configured',
        success: false 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const q = searchParams.get('q') || 'top tracks';

    const token = await getSpotifyToken();
    
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=${pageSize}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our Content interface
    

    const transformedTracks = data.tracks.items.map((track: SpotifyTrack) => ({
      id: `music-${track.id}`,
      title: `${track.name} - ${track.artists[0]?.name}`,
      description: `Album: ${track.album.name}`,
      imageUrl: track.album.images[0]?.url || '',
      url: track.external_urls.spotify,
      category: 'music' as const,
      publishedAt: track.album.release_date || new Date().toISOString(),
      source: 'Spotify'
    }));

    return NextResponse.json({
      success: true,
      content: transformedTracks,
      totalResults: data.tracks.total || 0
    });

  } catch (error) {
    console.error('Music API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch music',
      success: false 
    }, { status: 500 });
  }
}