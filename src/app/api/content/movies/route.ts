import { Movie } from '@/types/types';
import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  try {
    if (!TMDB_API_KEY) {
      return NextResponse.json({ 
        error: 'TMDB API key not configured',
        success: false 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '2';
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const q = searchParams.get('q') || '';

    let url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
    
    if (q) {
      url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&page=${page}`;
    }

    const response = await fetch(url);

    
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our Content interface
    const transformedMovies = data.results.slice(0, pageSize).map((movie: Movie) => ({
      id: `movie-${movie.id}`,
      title: movie.title || 'No title',
      description: movie.overview || 'No description available',
      imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
      url: `https://www.themoviedb.org/movie/${movie.id}`,
      category: 'movies' as const,
      publishedAt: movie.release_date || new Date().toISOString(),
      source: 'TMDB'
    }));

    return NextResponse.json({
      success: true,
      content: transformedMovies,
      totalResults: data.total_results || 0
    });

  } catch (error) {
    console.error('Movies API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch movies',
      success: false 
    }, { status: 500 });
  }
}