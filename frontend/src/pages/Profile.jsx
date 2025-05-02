import { useState, useEffect, useRef } from 'react';
import { Camera, User, Mail, Phone, MapPin, Shield, Upload } from 'lucide-react';
import Navbar from '../Component/layout/Navbar';
import Footer from '../Component/layout/Footer';
import Card from '../Component/common/Card';
import Button from '../Component/common/Button';
import Loading from '../Component/common/Loading';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // If user has an avatar, set it as preview
    if (user?.avatar) {
      setPreview(user.avatar);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Clean up preview URL on unmount
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      await updateProfile(formData);
      setSelectedFile(null);
    } catch (error) {
      console.error('Avatar upload error:', error);
    }
  };

  if (!user) {
    return <Loading fullScreen text="Loading profile..." />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Avatar Card */}
            <Card>
              <div className="flex flex-col sm:flex-row items-center">
                <div className="relative group mb-6 sm:mb-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow">
                    {preview ? (
                      <img
                        src={preview}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={64} className="text-gray-400" />
                    )}
                  </div>
                  <div
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={handleUploadClick}
                  >
                    <Camera size={18} className="text-white" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="ml-0 sm:ml-6 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>

                  {user.isVerified ? (
                    <div className="flex items-center mt-2 justify-center sm:justify-start">
                      <Shield size={16} className="text-green-600 mr-1" />
                      <span className="text-sm text-green-600">Verified Account</span>
                    </div>
                  ) : (
                    <div className="flex items-center mt-2 justify-center sm:justify-start">
                      <Shield size={16} className="text-yellow-600 mr-1" />
                      <span className="text-sm text-yellow-600">Pending Verification</span>
                    </div>
                  )}

                  {selectedFile && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4"
                      onClick={handleUpload}
                      loading={loading}
                    >
                      <Upload size={16} className="mr-2" /> Save Avatar
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Personal Info Card */}
            <Card title="Personal Information">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200">
                  <div className="sm:w-1/3 text-gray-600 flex items-center mb-2 sm:mb-0">
                    <User size={18} className="mr-2" /> Full Name
                  </div>
                  <div className="sm:w-2/3 font-medium">{user.name}</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200">
                  <div className="sm:w-1/3 text-gray-600 flex items-center mb-2 sm:mb-0">
                    <Mail size={18} className="mr-2" /> Email
                  </div>
                  <div className="sm:w-2/3 font-medium">{user.email}</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200">
                  <div className="sm:w-1/3 text-gray-600 flex items-center mb-2 sm:mb-0">
                    <Phone size={18} className="mr-2" /> Phone
                  </div>
                  <div className="sm:w-2/3 font-medium">{user.phone}</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-2">
                  <div className="sm:w-1/3 text-gray-600 flex items-center mb-2 sm:mb-0">
                    <MapPin size={18} className="mr-2" /> Address
                  </div>
                  <div className="sm:w-2/3 font-medium">{user.address}</div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" fullWidth>
                  Edit Profile
                </Button>
              </div>
            </Card>

            {/* Account Statistics */}
            <Card title="Account Statistics">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Current Balance</h3>
                  <p className="text-2xl font-bold text-blue-600">${user.balance.toFixed(2)}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Money Received</h3>
                  <p className="text-2xl font-bold text-green-600">{user.moneyReceived}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800 mb-1">Money Sent</h3>
                  <p className="text-2xl font-bold text-purple-600">{user.moneySend}</p>
                </div>
              </div>
            </Card>

            {/* Security Settings */}
            <Card title="Security Settings">
              <div className="space-y-4">
                <div>
                  <Button variant="outline" fullWidth>
                    Change Password
                  </Button>
                </div>

                <div>
                  <Button variant="outline" fullWidth>
                    Two-Factor Authentication
                  </Button>
                </div>

                <div>
                  <Button variant="outline" fullWidth>
                    Login History
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
