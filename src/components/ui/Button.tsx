interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'button'
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'landing';
  disabled?: boolean;
  className?: string
}

export default function Button({ 
  children, 
  onClick, 
  type,
  variant = 'primary', 
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = " px-4 py-2 rounded ";
  
  const variants ={
    primary: " bg-blue-900 text-white hover:bg-blue-700 ",
    secondary: " bg-gray-200 text-gray-700 hover:bg-gray-300 ",
    danger: " bg-red-600 text-white hover:bg-red-700 ",
    landing:" bg-blue-600 text-white hover:bg-blue-700 "
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}