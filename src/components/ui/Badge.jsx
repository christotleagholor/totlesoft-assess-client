import { cn } from '../../lib/utils';

const variants = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  brand: "bg-brand-yellow text-brand-black",
  dark: "bg-brand-black text-white",
};

export const Badge = ({ children, variant = 'default', className }) => {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};