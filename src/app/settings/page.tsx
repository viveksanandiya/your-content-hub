'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';

type ContentCategory = 'news' | 'movies' | 'music' | 'technology' | 'sports' | 'entertainment';

const CATEGORIES: { value: ContentCategory; label: string; description: string }[] = [
  { value: 'news', label: 'News', description: 'Latest news from around the world' },
  { value: 'movies', label: 'Movies', description: 'Movie recommendations and reviews' },
  { value: 'music', label: 'Music', description: 'Latest music and artist updates' },
  { value: 'technology', label: 'Technology', description: 'Tech news and innovations' },
  { value: 'sports', label: 'Sports', description: 'Sports news and match updates' },
  { value: 'entertainment', label: 'Entertainment', description: 'Celebrity news and entertainment content' }
];

export default function SettingsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<ContentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (user && initialLoad) {
      loadUserPreferences();
      setInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading, user, router, initialLoad]);

  const loadUserPreferences = async () => {
    try {
      const response = await fetch(`/api/preferences/${user?._id}`);
      const data = await response.json();
      
      if (data.success && data.message && data.message.category) {
        setSelectedCategories(data.message.category);
      } else {
        // Set default categories if no preferences exist
        setSelectedCategories(['news', 'technology', 'entertainment']);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      setMessage('Failed to load preferences');
      setMessageType('error');
      // Set default categories on error
      setSelectedCategories(['news', 'technology', 'entertainment']);
    }
  };

  const handleCategoryToggle = (category: ContentCategory) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Don't allow removing all categories
        if (prev.length === 1) {
          setMessage('You must select at least one category');
          setMessageType('error');
          setTimeout(() => setMessage(''), 3000);
          return prev;
        }
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const savePreferences = async () => {
    if (!user) return;

    if (selectedCategories.length === 0) {
      setMessage('Please select at least one category');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/preferences/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategories })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Preferences saved successfully! 🎉');
        setMessageType('success');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(data.error || 'Failed to save preferences');
        setMessageType('error');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Failed to save preferences. Please try again.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };


  if (loading || initialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Customize your content preferences and account settings</p>
        </div>

        {/* Content Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Preferences</h2>
          <p className="text-gray-600 mb-6">
            Choose the types of content you'd like to see in your dashboard. 
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {CATEGORIES.map((category) => (
              <div
                key={category.value}
                // eslint-disable-next-line react/no-unescaped-entities
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedCategories.includes(category.value)? 'border-blue-500 bg-blue-50 shadow-md': 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
                onClick={() => handleCategoryToggle(category.value)}
              >
                <div className="flex items-start space-x-3">
                  <input type="checkbox" checked={selectedCategories.includes(category.value)} onChange={() => handleCategoryToggle(category.value)} className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" onClick={(e) => e.stopPropagation()} />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              messageType === 'error' 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-green-50 text-green-600 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <Button
            onClick={savePreferences}
            disabled={isLoading || selectedCategories.length === 0}
            className={`px-6 py-2 ${
              isLoading || selectedCategories.length === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                Saving...
              </span>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>

        {/* Account Settings like name , email*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}