'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import { Content, ContentCategory } from '@/types/types';

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userPreferences, setUserPreferences] = useState<ContentCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<ContentCategory | 'all'>('all');

  useEffect(() => {
    if (!loading && !isAuthenticated){
      router.push('/auth');
      return;
    }

    if (user) {
      loadUserPreferences();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isAuthenticated, loading, user,router]);

  useEffect(() => {
    if (user && userPreferences.length > 0) {
      loadContent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeCategory, userPreferences, user]);

  const loadUserPreferences = async()=>{
    try{
      const response = await fetch(`/api/preferences/${user?._id}`);
      const data = await response.json();
      
      if(data.success && data.message && data.message.category){
        setUserPreferences(data.message.category);
      } else{
        // Set default preferences if none exist
        setUserPreferences(['news', 'technology', 'entertainment']);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      setUserPreferences(['news', 'technology', 'entertainment']);
    }
  };

  const loadContent = async ()=>{
    try{
      setIsLoading(true);
      setError('');

      const searchQuery = searchParams?.get('search');
      let allContent: Content[] =[];

      // Determine which categories to load
      const categoriesToLoad = activeCategory === 'all' 
        ? userPreferences 
        : [activeCategory];

      // Load content for each category
      for (const category of categoriesToLoad) {
        try {
          let apiUrl = '';
          // let response;

          switch (category){
            case 'news':
              apiUrl = `/api/news?category=general&pageSize=10${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
              break;

            case 'movies':
              apiUrl = `/api/content/movies?pageSize=8${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
              break;

            case 'music':
              apiUrl = `/api/content/music?pageSize=8${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
              break;
            
            case 'technology':
              apiUrl = `/api/content/technology?pageSize=8${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
              break;
            
            case 'sports':
              apiUrl = `/api/content/sports?pageSize=8${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
              break;
          
            case 'entertainment':
              apiUrl = `/api/content/entertainment?pageSize=8${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
              break;
        
            default:
              continue;
          }

          const response: Response= await fetch(apiUrl);
          const data = await response.json();
          
          if(data.success){
      
            const contentKey = category === 'news' ? 'articles' : 'content';
      
            if(data[contentKey] && Array.isArray(data[contentKey]) ){
              allContent = [...allContent, ...data[contentKey]];
            }
      
          } else {

            console.error(`Failed to load ${category}:`, data.error);
            // Fallback to mock data if API fails
            if(category !== 'news'){

              const fallbackResponse = await fetch(`/api/content?category=${category}&pageSize=5`);
              const fallbackData = await fallbackResponse.json();
              
              if (fallbackData.success && fallbackData.content) {
                allContent = [...allContent, ...fallbackData.content];
              }
              
            }
          }
        }catch(error){

          console.error(`Error loading ${category}:`, error);
          
        }
      }

      // Remove duplicates card title and URL are sued
      const uniqueContent = allContent.filter((item, index, self) => 
        index === self.findIndex(t => t.title === item.title && t.url === item.url)
      );

      // Filter by search query if present
      let filteredContent = uniqueContent;
      if (searchQuery) {
        filteredContent = uniqueContent.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sort by published date (newest first)
      filteredContent.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());


      setContent(filteredContent);
    
    }catch(error) {
      console.error('Error loading content:', error);
      setError('Failed to load content. Please try again.');
    } 
      setIsLoading(false);

  };

  const handleFavorite = async (content: Content) => {
    console.log('Content favorited:', content.title);
    // The ContentCard part can handles the API call
  };

  const handleRemoveFavorite = async (contentId: string) => {

    setContent(prev => prev.filter(item => item.id !== contentId));
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const categories: { value: ContentCategory | 'all'; label: string }[] =[
    { value: 'all', label: 'All'},
    { value: 'news', label: 'News'},
    { value: 'technology', label: 'Technology'},
    { value: 'movies', label: 'Movies' },
    { value: 'music', label: 'Music'},
    { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label:'Entertainment'}
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
      
          <p className="text-gray-600 mt-2">
            {activeCategory === 'all' ? `Your personalized content from: ${userPreferences.join(', ')}`
              : `Showing ${activeCategory} content`
            }
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            
            {categories.map((category)=> (
              
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >

                {category.label}
                {category.value === 'all' && userPreferences.length > 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({userPreferences.length})
                  </span>
                )}
              </button>
            ))}

          </div>
          
          
        </div>

        {/* Content Grid */}
        {isLoading ? (

          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading content...</p>
            </div>
          </div>

        ) : error ? (

          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
              <button
                onClick={loadContent}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
 
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {content.length === 0 ? (
              <div className="col-span-full text-center py-12">
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                <p className="text-gray-500 mb-4">
                  No {activeCategory} content available right now
                </p>
                
                  <button
                    onClick={() => router.push('/settings')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Update Preferences
                  </button>
                
              </div>
            ) : (
              content.map((item) => (
                <ContentCard 
                  key={`${item.id}-${item.title}`} 
                  content={item} 
                  onFavorite={handleFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                  showCategory={activeCategory === 'all'}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}