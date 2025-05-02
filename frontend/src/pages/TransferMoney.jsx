import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Check } from 'lucide-react';
import Navbar from '../Component/layout/Navbar';
import Footer from '../Component/layout/Footer';
import Card from '../Component/common/Card';
import Button from '../Component/common/Button';
import Input from '../Component/common/Input';
import Loading from '../Component/common/Loading';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import Modal from '../Component/common/Modal';
import axios from 'axios';  // Importing axios

const TransferMoney = () => {
  const { user } = useAuth();
  const { sendMoney, verifyReceiver, loading } = useTransaction();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get('http://localhost:8000/api/user/get_users', { 
          withCredentials: true  // Include credentials for session-based authentication
        });

        // Make sure the response data contains users
        setUsers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);
  
  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setStep(2);
  };
  
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError('');
  };
  
  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return false;
    }
    if (numAmount <= 0) {
      setError('Amount must be greater than zero');
      return false;
    }
    if (numAmount > (user?.balance || 0)) {
      setError('Insufficient balance');
      return false;
    }
    return true;
  };
  
  const handleNext = () => {
    if (validateAmount()) setStep(3);
  };
  
  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };
  
  const handleSubmit = async () => {
    if (!validateAmount()) return;
    try {
      await sendMoney({
        receiver: selectedUser._id,
        amount: parseFloat(amount),
        transactionType: 'Transfer',
        reference: reference || 'General transfer'
      });
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (loadingUsers && step === 1) {
    return <Loading fullScreen text="Loading users..." />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
            <p className="text-gray-600">Transfer funds to friends and family</p>
          </div>
          <Card>
            <div className="mb-6">
              {/* Stepper */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((s, i) => (
                  <>
                    <div
                      key={s}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {s}
                    </div>
                    {i < 2 && (
                      <div className={`h-1 w-16 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    )}
                  </>
                ))}
              </div>

              {/* Step 1: Select Recipient */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Select Recipient</h2>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      <div className="divide-y">
                        {filteredUsers.map((user) => (
                           <div
                           key={user._id} // Ensure this is unique and correct
                           className="py-3 flex items-center hover:bg-gray-50 cursor-pointer px-2 rounded"
                           onClick={() => handleUserSelect(user)}
                         >
                            <div className="flex-shrink-0">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <div className="ml-auto">
                              <ArrowRight size={18} className="text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No users found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Enter Amount */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Enter Amount</h2>
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        {selectedUser.avatar ? (
                          <img src={selectedUser.avatar} alt={selectedUser.name} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            {selectedUser.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{selectedUser.name}</p>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={amount}
                          onChange={handleAmountChange}
                          className={`block w-full pl-7 pr-12 py-2 rounded-md ${
                            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                      <p className="mt-1 text-sm text-gray-500">
                        Available balance: ${user?.balance?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reference (Optional)</label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Reference"
                      />
                    </div>
                  </div>
                  <div>
                    <Button variant="secondary" onClick={handleBack}>Back</Button>
                    <Button variant="primary" onClick={handleNext}>Next</Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm and Transfer */}
              {step === 3 && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Confirm Transfer</h2>
                  <p className="mb-4">Transfer {amount} to {selectedUser.name}?</p>
                  <div className="mb-6">
                    <p><strong>Receiver:</strong> {selectedUser.name}</p>
                    <p><strong>Amount:</strong> ${amount}</p>
                    {reference && <p><strong>Reference:</strong> {reference}</p>}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={handleBack}>Back</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Processing...' : 'Confirm Transfer'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Success Modal */}
      <Modal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div className="text-center">
          <Check size={40} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Transfer Successful!</h3>
          <p className="text-gray-600 mt-2">Your transfer has been completed.</p>
          <Button variant="primary" onClick={handleGoToDashboard}>Go to Dashboard</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TransferMoney;
