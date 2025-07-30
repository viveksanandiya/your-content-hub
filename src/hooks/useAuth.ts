import { useState, useEffect } from 'react';
import { User, UseAuthReturn } from '@/types/types';

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = () => {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');

      if (userId && username && email) {
        setUser({
          _id: userId,
          username,
          email
        });
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!data.success || data.error) {
        setError(data.error || 'Login failed');
        return false;
      }

      // Store user data
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('email', data.user.email);
      
      setUser(data.user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!data.success || data.error) {
        setError(data.error || 'Signup failed');
        return false;
      }

      // Store user data
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('email', data.user.email);
      
      setUser(data.user);
      return true;
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.error('Logout API call failed:', err);
    }

    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    
    setUser(null);
    setError('');
  };

  
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    loading,
    error
  };
}
