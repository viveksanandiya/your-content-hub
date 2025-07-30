interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void
}

export default function Card({ children, className ='', onClick}: CardProps){
  return (
    <div 
      className={`bg-white rounded border border-gray-200 p-4 hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}