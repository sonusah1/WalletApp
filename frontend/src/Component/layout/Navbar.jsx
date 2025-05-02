import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="PayFlow Logo" className="h-8 mr-2" />
              <span className="text-2xl font-bold text-blue-600">PayFlow</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/transfer" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  Send Money
                </Link>
                <Link to="/request" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  Request
                </Link>
                <Link to="/transactions" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  History
                </Link>
                
                <div className="ml-4 flex items-center">
                  <div className="relative group">
                    <button className="flex items-center focus:outline-none">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {user?.name?.charAt(0)}
                        </div>
                      )}
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-gray-500 text-xs">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <User size={16} className="mr-2" />
                          Profile
                        </div>
                      </Link>
                      {user?.isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <div className="flex items-center">
                            <CreditCard size={16} className="mr-2" />
                            Admin Panel
                          </div>
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/"
              className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard"
                  className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/transfer"
                  className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Send Money
                </Link>
                <Link 
                  to="/request"
                  className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Request
                </Link>
                <Link 
                  to="/transactions"
                  className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  History
                </Link>
                <Link 
                  to="/profile"
                  className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                {user?.isAdmin && (
                  <Link 
                    to="/admin"
                    className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="block   rounded bg-blue-600 text-white hover:bg-blue-700 px-3 py-2"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
