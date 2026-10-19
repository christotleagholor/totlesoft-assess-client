import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleExit = () => {
    // Clear session and return to main site
    sessionStorage.clear();
    window.location.href = import.meta.env.VITE_MAIN_SITE_URL || "http://localhost:3000";
  };

  return (
    <header className="bg-brand-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="Totlesoft" 
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            onError={(e) => {
              // Fallback if logo image is missing
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback Logo */}
          <div className="hidden w-10 h-10 bg-brand-yellow rounded-full items-center justify-center font-bold text-brand-black text-xl">
            T
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-wide block leading-tight">TOTLESOFT</span>
            <span className="text-[10px] text-brand-yellow uppercase tracking-wider font-semibold">Assessment Portal</span>
          </div>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
            <User className="w-4 h-4" />
            <span>Assessment Mode</span>
          </div>
          
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
};