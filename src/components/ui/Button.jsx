import { cn } from '../../lib/utils';

const variants = {
  primary: "bg-brand-yellow text-brand-black hover:bg-yellow-400 active:scale-[0.98]",
  secondary: "bg-brand-black text-white hover:bg-gray-800 active:scale-[0.98]",
  outline: "border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white active:scale-[0.98]",
  ghost: "text-brand-black hover:bg-gray-100 active:bg-gray-200",
  danger: "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm font-medium",
  md: "px-5 py-2.5 text-sm font-semibold",
  lg: "px-8 py-3.5 text-base font-bold",
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading, 
  disabled, 
  ...props 
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2",
        variants[variant],
        sizes[size],
        (disabled || isLoading) && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};