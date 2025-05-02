import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../Component/common/Button';
import Navbar from '../Component/layout/Navbar';
import Footer from '../Component/layout/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Page not found
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We couldn't find the page you're looking for.
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button variant="primary" size="lg">
                <Home className="mr-2" size={18} />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;