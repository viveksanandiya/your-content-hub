import { NextResponse } from 'next/server';

// Mock data for backward compatibility and fallback
const mockMovies = [
  {
    id: 'movie-1',
    title: 'The Matrix Resurrections',
    description: 'Neo must choose once again between reality and illusion.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/8c4a8kE7PizaGQQnditMmI1xbRp.jpg',
    url: 'https://www.themoviedb.org/movie/624860',
    category: 'movies',
    publishedAt: '2021-12-22T00:00:00.000Z',
    source: 'TMDB'
  },
  {
    id: 'movie-2',
    title: 'Spider-Man: No Way Home',
    description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    url: 'https://www.themoviedb.org/movie/634649',
    category: 'movies',
    publishedAt: '2021-12-17T00:00:00.000Z',
    source: 'TMDB'
  }
];

const mockMusic = [
  {
    id: 'music-1',
    title: 'Bad Habits - Ed Sheeran',
    description: 'Latest hit single from Ed Sheeran',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2737ccca9fbcf070ebd87db3f13',
    url: 'https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb',
    category: 'music',
    publishedAt: '2021-06-25T00:00:00.000Z',
    source: 'Spotify'
  },
  {
    id: 'music-2',
    title: 'Stay - The Kid LAROI & Justin Bieber',
    description: 'Collaborative hit between The Kid LAROI and Justin Bieber',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b273938ebc4a5dde0264b4c3ba8e',
    url: 'https://open.spotify.com/track/5PjdY0CKGZdEuoNab3yDmX',
    category: 'music',
    publishedAt: '2021-07-09T00:00:00.000Z',
    source: 'Spotify'
  }
];

const mockTechnology = [
  {
    id: 'tech-1',
    title: 'OpenAI Releases GPT-4 Turbo',
    description: 'New model with improved capabilities and lower costs',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500',
    url: 'https://openai.com/gpt-4',
    category: 'technology',
    publishedAt: '2024-01-15T00:00:00.000Z',
    source: 'OpenAI'
  },
  {
    id: 'tech-2',
    title: 'Apple Vision Pro Launch',
    description: 'Apple\'s revolutionary spatial computing device',
    imageUrl: 'https://images.unsplash.com/photo-1592659762303-90081d34b277?w=500',
    url: 'https://apple.com/vision-pro',
    category: 'technology',
    publishedAt: '2024-02-02T00:00:00.000Z',
    source: 'Apple'
  }
];

const mockSports = [
  {
    id: 'sport-1',
    title: 'ICC Cricket World Cup 2023',
    description: 'India wins the Cricket World Cup after 12 years',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500',
    url: 'https://icc-cricket.com',
    category: 'sports',
    publishedAt: '2023-11-19T00:00:00.000Z',
    source: 'ICC'
  },
  {
    id: 'sport-2',
    title: 'FIFA World Cup 2022 Highlights',
    description: 'Argentina defeats France in thrilling final',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
    url: 'https://fifa.com',
    category: 'sports',
    publishedAt: '2022-12-18T00:00:00.000Z',
    source: 'FIFA'
  }
];

const mockEntertainment = [
  {
    id: 'ent-1',
    title: 'Taylor Swift Eras Tour',
    description: 'Record-breaking concert tour continues worldwide',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    url: 'https://taylorswift.com',
    category: 'entertainment',
    publishedAt: '2024-01-10T00:00:00.000Z',
    source: 'Entertainment Weekly'
  },
  {
    id: 'ent-2',
    title: 'Marvel Phase 5 Announcement',
    description: 'New superhero movies and series revealed',
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500',
    url: 'https://marvel.com',
    category: 'entertainment',
    publishedAt: '2024-01-05T00:00:00.000Z',
    source: 'Marvel Studios'
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let content: any[] = [];

    // This route now serves as a fallback and for mixed content
    switch (category) {
      case 'movies':
        content = mockMovies;
        break;
      case 'music':
        content = mockMusic;
        break;
      case 'technology':
        content = mockTechnology;
        break;
      case 'sports':
        content = mockSports;
        break;
      case 'entertainment':
        content = mockEntertainment;
        break;
      default:
        // Return all content types mixed for backward compatibility
        content = [...mockMovies, ...mockMusic, ...mockTechnology, ...mockSports, ...mockEntertainment];
    }

    // Simulate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedContent = content.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      content: paginatedContent,
      totalResults: content.length
    });

  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch content',
      success: false 
    }, { status: 500 });
  }
}