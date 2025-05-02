import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../Component/common/Input';
import Button from '../../Component/common/Button';
import Card from '../../Component/common/Card';
import Navbar from '../../Component/layout/Navbar';
import Footer from '../../Component/layout/Footer';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    identificationType: 'passport',
    balance: 1000, // Default initial balance
    address: '',
    avatar: null, // Avatar is nullable
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.address) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      // Additional fixed fields required by backend
      formDataToSend.append('moneySend', '0');
      formDataToSend.append('moneyReceived', '0');
      formDataToSend.append('requestReceived', '0');

      await register(formDataToSend);
      navigate('/login');
    } catch (error) {
      // Error handling is done in the register function
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>

          <div className="mb-8">
            <div className="relative">
              <div className="flex items-center justify-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step === 1 ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800'
                  }`}
                >
                  1
                </div>
                <div className={`h-1 w-20 ${step === 1 ? 'bg-gray-300' : 'bg-blue-600'}`}></div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step === 2 ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800'
                  }`}
                >
                  2
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs ml-1">Account</span>
                <span className="text-xs mr-1">Details</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  error={errors.name}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  error={errors.phone}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  error={errors.password}
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  error={errors.confirmPassword}
                />

                <div className="flex justify-end mt-6">
                  <Button type="button" onClick={handleNext} variant="primary">
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                  <select
                    name="identificationType"
                    value={formData.identificationType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Passport">passport</option>
                    <option value="Driver License">Driving Lisence</option>
                    <option value="National ID">National ID</option>
                  </select>
                </div>

                <Input
                  label="Address"
                  name="address"
                  placeholder="123 Main St, City, Country"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  error={errors.address}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit (Optional)</label>
                  <input
                    type="number"
                    name="balance"
                    min="0"
                    value={formData.balance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">Default: $1000 (for demo purposes)</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" onClick={handleBack} variant="outline">
                    Back
                  </Button>
                  <Button type="submit" variant="primary" loading={loading}>
                    Register
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
