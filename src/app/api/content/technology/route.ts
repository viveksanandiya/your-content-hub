import { NextResponse } from 'next/server';

const TECH_NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function GET(request: Request) {
  try {
    if (!TECH_NEWS_API_KEY) {
      return NextResponse.json({ 
        error: 'Tech News API key not configured',
        success: false 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '20';
    const q = searchParams.get('q') || 'technology';

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&domains=techcrunch.com,theverge.com,wired.com,arstechnica.com&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${TECH_NEWS_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Tech News API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our Content interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedArticles = data.articles.map((article: any, index: number) => ({
      id: `tech-${Date.now()}-${index}`,
      title: article.title || 'No title',
      description: article.description || 'No description available',
      imageUrl: article.urlToImage || '',
      url: article.url || '',
      category: 'technology' as const,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || 'Tech News'
    }));

    return NextResponse.json({
      success: true,
      content: transformedArticles,
      totalResults: data.totalResults || 0
    });

  } catch (error) {
    console.error('Technology API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch technology content',
      success: false 
    }, { status: 500 });
  }
}