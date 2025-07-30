import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: Request) {
  try {
    if (!NEWS_API_KEY) {
      return NextResponse.json({ 
        error: 'News API key not configured',
        success: false 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '20';
    const country = searchParams.get('country') || 'in'; // India
    const q = searchParams.get('q') || '';

    let url = `${NEWS_API_BASE_URL}/top-headlines?country=${country}&pageSize=${pageSize}&page=${page}&apiKey=${NEWS_API_KEY}`;
    
    if (category && category !== 'general') {
      url += `&category=${category}`;
    }
    
    if (q) {
      url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(q)}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our Content interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedArticles = data.articles.map((article: any, index: number) => ({
      id: `news-${Date.now()}-${index}`,
      title: article.title || 'No title',
      description: article.description || 'No description available',
      imageUrl: article.urlToImage || '',
      url: article.url || '',
      category: 'news' as const,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || 'Unknown'
    }));

    return NextResponse.json({
      success: true,
      articles: transformedArticles,
      totalResults: data.totalResults || 0
    });

  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch news',
      success: false 
    }, { status: 500 });
  }
}