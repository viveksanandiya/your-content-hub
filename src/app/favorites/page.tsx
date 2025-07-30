'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import { Content, Favorite } from '@/types/types';
import { LayoutDashboard, RefreshCcw} from 'lucide-react';

export default function FavoritesPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (user){
      loadFavorites();
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated,loading, user, router]);

  const loadFavorites= async()=>{
    
    try{
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`/api/favorites/${user?._id}`);
      const data = await response.json();
      
      if (data.success && data.message && Array.isArray(data.message)) {
        // Transform favorites to Content format

        const transformedFavorites: Content[] = data.message.map((fav: Favorite)=>({
          id: fav._id,
          title: fav.title,
          description: fav.description,
          imageUrl: fav.imageUrl,
          url: fav.url,
          category: fav.category,
          publishedAt: fav.createdAt || new Date().toISOString(),
          source: 'Favorites'
        }));
      
        setFavorites(transformedFavorites);
      
      }else {
        setFavorites([]);
      }
    
    } catch (error) {

      console.error('Error loading favorites:', error);
      setError('Failed to load favorites');
      setFavorites([]);
    } 

      setIsLoading(false);
  };

  const handleRemoveFavorite = async (contentId: string) => {
    try {
      
      const response = await fetch(`/api/favorites/${user?._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      });

      const data = await response.json();

      if(data.success){
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.id !== contentId));
      }

    }catch(error){
      console.error('Error removing favorite:', error);
      alert('Something went wrong. Please try again.');
    }

  };

  

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              Error fetching your favorite
            </div>
            <button
              onClick={loadFavorites}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {favorites.length === 0 && !error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Click the heart icon to save items you want to read later.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="gap-2 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <LayoutDashboard size={18}/>Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* refresh */}
            {favorites.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  
                  <button
                    onClick={loadFavorites}
                    className="gap-2 inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    title="Refresh favorites"
                  >
                    <RefreshCcw size={16}/>Refresh
                  </button>
                </div>
              </div>
            )}

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onRemoveFavorite={handleRemoveFavorite}
                  isFavorited={true}
                  showCategory={true}
                />
              ))}
            </div>

          </>
        )}
      </main>
    </div>
  );
}