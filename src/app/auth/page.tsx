'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AuthPage(){
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setErrorMessage('');

    const endpoint = isLogin ? '/api/auth/signin' : '/api/auth/signup';
    const payload = isLogin ? {username: formData.username, password: formData.password}: formData;

    try {
      const res = await fetch(endpoint,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if(!data.success || data.error){
        setErrorMessage(data.error || 'Authentication failed');
      }else{
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);
        
        router.push('/dashboard');
        
        // Force a page refresh to ensure middleware runs
        window.location.href = '/dashboard';
      }
    }catch(err){
      console.error('Auth error:', err);
      setErrorMessage('Something went wrong. Please try again.');
    }    

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-md w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ContentHub
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <div className="flex mb-6">

          <button onClick={()=>{
              setIsLogin(true);
              setErrorMessage('');
              setFormData({ username:'', email:'', password:''});
            }}

            className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-colors ${
              isLogin ? 'bg-blue-600 text-white': 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Login
          </button>

          <button onClick={() => {
              setIsLogin(false);
              setErrorMessage('');
              setFormData({ username: '', email: '', password: '' });
            }}

            className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-colors ${
              !isLogin ? 'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            placeholder="Enter username"
          />

          {!isLogin && (
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email"
            />
          )}

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Enter password"
          />

          {errorMessage && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {errorMessage}
            </div>
          )}

          <Button
            variant="primary"
            disabled={loading}
            className="w-full"
            
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </Button>
        </form>
      </div>
    </div>
  );
}
