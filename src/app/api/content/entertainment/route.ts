import { NewsArticle } from '@/types/types';
import { NextResponse } from 'next/server';

const ENTERTAINMENT_API_KEY = process.env.NEWS_API_KEY;

export async function GET(request: Request) {
  try {
    if (!ENTERTAINMENT_API_KEY) {
      return NextResponse.json({ 
        error: 'Entertainment API key not configured',
        success: false 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '20';
    const q = searchParams.get('q') || '';

    let url = `https://newsapi.org/v2/top-headlines?category=entertainment&pageSize=${pageSize}&page=${page}&apiKey=${ENTERTAINMENT_API_KEY}`;
    
    if (q) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&domains=variety.com,hollywoodreporter.com,ew.com&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${ENTERTAINMENT_API_KEY}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Entertainment API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our Content interface
    const transformedArticles = data.articles.map((article: NewsArticle, index: number) => ({
      id: `entertainment-${Date.now()}-${index}`,
      title: article.title || 'No title',
      description: article.description || 'No description available',
      imageUrl: article.urlToImage || '',
      url: article.url || '',
      category: 'entertainment' as const,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || 'Entertainment News'
    }));

    return NextResponse.json({
      success: true,
      content: transformedArticles,
      totalResults: data.totalResults || 0
    });

  } catch (error) {
    console.error('Entertainment API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch entertainment content',
      success: false 
    }, { status: 500 });
  }
}