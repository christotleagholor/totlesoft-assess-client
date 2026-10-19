import { NavBar } from './NavBar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-gray">
      <NavBar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="w-full border-t border-brand-border bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-brand-textMuted">
          &copy; {new Date().getFullYear()} Totlesoft. All rights reserved.
        </div>
      </footer>
    </div>
  );
};