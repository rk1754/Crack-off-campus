
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-foundit-gray">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-6xl font-bold text-foundit-blue mb-4">404</h1>
          <p className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</p>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Return to Homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
