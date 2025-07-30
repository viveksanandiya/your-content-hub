import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import SearchBar from '@/components/ui/Searchbar';
import Button from '@/components/ui/Button';
import { ChevronDown, User } from 'lucide-react';


export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/dashboard?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ContentHub</h1>
            </Link>
            
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-6">
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/favorites" 
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Favorites
                </Link>
                <Link 
                  href="/settings" 
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Settings
                </Link>
              </nav>
            )}
          </div>


          {isAuthenticated && (
            <div className="flex-1 max-w-24 sm:max-w-sm md:max-w-md lg:max-w-lg mx-4 hidden md:block">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search news, movies, music..."
              />
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className='text-white'/>
                  </div>
                  <span className="hidden font-medium">{user?.username}</span>
                   <ChevronDown className= {`transition-transform ${showUserMenu ? 'rotate-180' : ''}`}/>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 md:w-58 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-medium">{user?.username}</p>
                        <p className="text-gray-500">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Favorites
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth">
                  <Button variant="secondary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="primary">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isAuthenticated && (
          <div className="md:hidden pb-4">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search..."
            />
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}