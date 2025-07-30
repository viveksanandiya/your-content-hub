'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ContentHub</h1>
          <div className="space-x-4">
            {isLoggedIn ? (
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => router.push('/auth')}>
                  Login
                </Button>
                <Button onClick={() => router.push('/auth')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* center part */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Your Personalized Content Dashboard
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stay updated with news, discover movies, and track your favorite content all in one place. 
            Customize your feed based on your interests.
          </p>
          <Button onClick={handleGetStarted} className="text-lg px-8 py-3">
            {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </main>

      
    </div>
  );
}