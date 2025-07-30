
export interface User{
  _id:string;
  username: string;
  email: string;
  password?: string; 
}

export interface AuthResponse{
  message: string
  userId?: string;
  error?:string;
}

export interface Content{
  id: string;
  title: string;
  description:string;
  imageUrl: string;
  url: string;
  category: ContentCategory;
  publishedAt: string;
  source?: string
}

export type ContentCategory = 'news' |'movies' |'music' |'technology' |'sports' |'entertainment'

// Favorite related types
export interface Favorite{
  _id: string;
  userId: string;
  category: ContentCategory;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  createdAt: string;
  updatedAt?: string
}

export interface FavoriteResponse{
  message: Favorite[] | Favorite;
  error?: string
}

export interface Preference{
  _id: string;
  userId: string;
  category: ContentCategory[]
}

export interface PreferenceResponse {
  message: Preference;
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T=any> {
  message: T;
  error?: string;
}

// Form related types
export interface AuthFormData{
  username: string;
  email: string;
  password: string;
}

export interface LoginFormData{
  username: string;
  password: string;
}

// Component prop types
export interface ButtonProps{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' |'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  type?: 'button' |'submit' |'reset'
}

export interface InputProps{
  label?: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string
}

export interface CardProps{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ModalProps{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface SearchBarProps{
  onSearch: (query: string) => void;
  placeholder?: string;
}

// Hook return types
export interface UseAuthReturn{
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
} 

// News API types (for external API integration)
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface SpotifyTrack {
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        images: Array<{ url: string }>;
        release_date: string;
      };
      external_urls: {
        spotify: string;
      };
    }

// Movie API types (for external API integration)
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface MovieApiResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}