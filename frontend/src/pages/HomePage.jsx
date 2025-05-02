import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Globe, Clock, CreditCard, DollarSign, Send } from 'lucide-react';
import Navbar from '../Component/layout/Navbar';
import Footer from '../Component/layout/Footer';
import Button from '../Component/common/Button';
import { useAuth } from '../context/AuthContext';
import Modal from '../Component/common/Modal';
import Login from './auth/Login';

const HomePage = ({ showAuth, setShowAuth }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="mb-12 lg:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Fast, Secure Money Transfers for Everyone
                </h1>
                <p className="text-lg md:text-xl mb-8 text-blue-100">
                  Send and receive money instantly with the most trusted financial platform. No hidden fees, no waiting.
                </p>
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button variant="primary" size="lg">
                      Go to Dashboard <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/register">
                      <Button variant="primary" size="lg">
                        Get Started <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="bg-white hover:bg-blue-50">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <div className="lg:flex justify-center hidden">
                <img 
                  src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Money Transfer"
                  className="rounded-lg shadow-xl max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PayFlow?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform offers the best experience for sending and receiving money with the features you need.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Transfers</h3>
                <p className="text-gray-600">
                  Industry-leading security protocols ensure your money and data are always protected.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Instant Processing</h3>
                <p className="text-gray-600">
                  Send and receive money in seconds, not days. No more waiting for transactions to clear.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Global Access</h3>
                <p className="text-gray-600">
                  Send money anywhere in the world with competitive rates and transparent fees.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Getting started with PayFlow is simple and straightforward.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <div className="text-blue-600 font-bold text-xl">1</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up for free and verify your identity to get started.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <div className="text-blue-600 font-bold text-xl">2</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Add Your Payment Method</h3>
                <p className="text-gray-600">
                  Connect your bank account or add money to your PayFlow balance.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <div className="text-blue-600 font-bold text-xl">3</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Send or Request Money</h3>
                <p className="text-gray-600">
                  Transfer funds to anyone, anywhere, with just a few clicks.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Thousands of people trust PayFlow for their money transfer needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "PayFlow has transformed how I send money to my family abroad. It's fast, reliable, and much cheaper than traditional methods."
                </p>
                <div className="font-medium text-gray-900">Sarah Johnson</div>
                <div className="text-sm text-gray-500">Small Business Owner</div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The best part about PayFlow is how seamless it makes collecting payments from clients. I get paid instantly without the wait."
                </p>
                <div className="font-medium text-gray-900">Michael Rodriguez</div>
                <div className="text-sm text-gray-500">Freelance Designer</div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "I've tried many payment apps, but PayFlow stands out with its security features and user-friendly interface. Highly recommended!"
                </p>
                <div className="font-medium text-gray-900">Emily Chen</div>
                <div className="text-sm text-gray-500">College Student</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Better Money Transfers?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Join thousands of satisfied users who've made the switch to PayFlow.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Auth Modal */}
      {showAuth && !isAuthenticated && (
        <Modal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          title="Sign In to Continue"
        >
          <Login inModal={true} onSuccess={() => setShowAuth(false)} />
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
