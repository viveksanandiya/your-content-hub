import { useState } from 'react';
import { Content, ContentCategory } from '@/types/types';
import { useAuth } from '@/hooks/useAuth';
import { Heart, SquareArrowOutUpRight } from 'lucide-react';

interface ContentCardProps{
  content: Content;
  onFavorite?: (content: Content) => void;
  onRemoveFavorite?: (contentId: string) => void;
  isFavorited?: boolean;
  showCategory?: boolean;
}

export default function ContentCard({ 
  content, 
  onFavorite, 
  onRemoveFavorite, 
  isFavorited = false,
  showCategory = true 
}: ContentCardProps) {
  const { isAuthenticated, user } = useAuth();
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [localIsFavorited, setLocalIsFavorited] = useState(isFavorited);

  const getCategoryColor = (category: ContentCategory): string=>{
    const colors = {
      news: 'bg-blue-100 text-blue-800',
      movies: 'bg-purple-100 text-purple-800',
      music: 'bg-green-100 text-green-800',
      technology: 'bg-orange-100 text-orange-800',
      sports: 'bg-red-100 text-red-800',
      entertainment: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !user) return;

    setIsAddingToFavorites(true);

    try {
      if (localIsFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${user._id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            contentId: content.id,
            title: content.title,
            url: content.url
          })
        });

        const data = await response.json();

        if (data.success) {
          setLocalIsFavorited(false);
          onRemoveFavorite?.(content.id);
        } else {
          console.error('Failed to remove favorite:', data.error);
        }
      } else {
        // Add to favorites
        const favoriteData = {
          category: content.category,
          title: content.title,
          description: content.description,
          imageUrl: content.imageUrl,
          url: content.url
        };

        const response = await fetch(`/api/favorites/${user._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(favoriteData)
        });

        const data = await response.json();

        if (data.success) {
          setLocalIsFavorited(true);
          onFavorite?.(content);
        } else {
          console.error('Failed to add favorite:', data.error);
          
          alert('Failed to add to favorites')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'error date';
    }
  };

  const handleImageError = () => {
    <span>Image not available</span>
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {content.imageUrl ?(
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.imageUrl}
            alt={content.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-center">
            <span>no image</span>
          </div>
        )}
        
        {/* Category Badge */}
        {showCategory && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(content.category)}`}>
              {content.category.charAt(0).toUpperCase() + content.category.slice(1)}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteToggle}
            disabled={isAddingToFavorites}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
            title={localIsFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isAddingToFavorites ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
            
            ) : (

              <Heart className={`w-5 h-5 ${localIsFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}/>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {content.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {content.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{formatDate(content.publishedAt)}</span>
          {content.source && <span>{content.source}</span>}
        </div>

        {/* Action Button */}
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="gap-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 "
        >
          {content.category === 'movies' ? 'View Movie' : 
           content.category === 'music' ? 'Listen Now' : 
           'Read More'}
          <SquareArrowOutUpRight size={16}/>
        </a>
      </div>
    </div>
  );
}