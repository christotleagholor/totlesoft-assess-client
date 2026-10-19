import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Projects = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If they hit /projects directly, force them to SSO or Dashboard
    const token = sessionStorage.getItem("assess_token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/sso");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow"></div>
    </div>
  );
};