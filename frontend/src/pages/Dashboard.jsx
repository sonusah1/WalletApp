import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Plus, RotateCw, CreditCard, Send, PiggyBank, Wallet } from 'lucide-react';
import Navbar from '../Component/layout/Navbar';
import Footer from '../Component/layout/Footer';
import Card from '../Component/common/Card';
import Button from '../Component/common/Button';
import Loading from '../Component/common/Loading';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import Modal from '../Component/common/Modal';

const Dashboard = () => {
  const { user } = useAuth();
  const { getTransactionHistory, getReceivedRequests, depositMoney, loading } = useTransaction();
  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(100);
  const [loadingState, setLoadingState] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingState(true);
        const [transactions, requests] = await Promise.all([
          getTransactionHistory(),
          getReceivedRequests()
        ]);
        
        setRecentTransactions(Array.isArray(transactions) ? transactions : []);
        
        // Filter only pending requests
        const pendingReqs = Array.isArray(requests) 
          ? requests.filter(req => req.status === 'Pending')
          : [];
        setPendingRequests(pendingReqs);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingState(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleDeposit = async () => {
    try {
      await depositMoney(depositAmount);
      setIsDepositModalOpen(false);
      // Reload user data to update balance
      window.location.reload();
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };
  
  if (loadingState) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-600">
              Manage your finances with ease
            </p>
          </div>
          
          {/* Balance Card */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <p className="text-blue-100 mb-1">Your Balance</p>
                  <h2 className="text-4xl font-bold">${user?.balance.toFixed(2)}</h2>
                </div>
                
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button 
                    variant="primary" 
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsDepositModalOpen(true)}
                  >
                    <Plus size={18} className="mr-1" /> Add Money
                  </Button>
                  <Link to="/transfer">
                    <Button variant="primary" className="bg-white text-blue-600 hover:bg-blue-50">
                      <Send size={18} className="mr-1" /> Send Money
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link to="/transfer" className="block">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Send className="text-blue-600" size={20} />
                  </div>
                  <h3 className="font-semibold">Send Money</h3>
                  <p className="text-sm text-gray-500">Transfer to anyone</p>
                </div>
              </Card>
            </Link>
            
            <Link to="/request" className="block">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <PiggyBank className="text-green-600" size={20} />
                  </div>
                  <h3 className="font-semibold">Request Money</h3>
                  <p className="text-sm text-gray-500">Ask for payments</p>
                </div>
              </Card>
            </Link>
            
            <Link to="/transactions" className="block">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <RotateCw className="text-purple-600" size={20} />
                  </div>
                  <h3 className="font-semibold">Transaction History</h3>
                  <p className="text-sm text-gray-500">View your activity</p>
                </div>
              </Card>
            </Link>
            
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsDepositModalOpen(true)}>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                  <Wallet className="text-yellow-600" size={20} />
                </div>
                <h3 className="font-semibold">Add Money</h3>
                <p className="text-sm text-gray-500">Top up your balance</p>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Transactions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              <Card>
                {recentTransactions.length > 0 ? (
                  <div className="divide-y">
                    {recentTransactions.slice(0, 5).map((transaction) => {
                      const isSender = transaction.sender._id === user?._id;
                      const otherParty = isSender ? transaction.receiver : transaction.sender;
                      
                      return (
                        <div key={transaction._id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSender ? 'bg-red-100' : 'bg-green-100'}`}>
                              {isSender ? (
                                <ArrowUp className="text-red-600" size={20} />
                              ) : (
                                <ArrowDown className="text-green-600" size={20} />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">
                                {isSender ? `To: ${otherParty.name}` : `From: ${otherParty.name}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className={`font-medium ${isSender ? 'text-red-600' : 'text-green-600'}`}>
                            {isSender ? '-' : '+'}${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-gray-500">No recent transactions</p>
                    <Link to="/transfer">
                      <Button variant="outline" className="mt-3">
                        Send Money
                      </Button>
                    </Link>
                  </div>
                )}
                
                {recentTransactions.length > 0 && (
                  <div className="mt-4 text-center">
                    <Link to="/transactions">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>
            
            {/* Pending Requests */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
              <Card>
                {pendingRequests.length > 0 ? (
                  <div className="divide-y">
                    {pendingRequests.slice(0, 5).map((request) => (
                      <div key={request._id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <CreditCard className="text-orange-600" size={20} />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">
                              Request from {request.sender.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {request.description}
                            </p>
                          </div>
                        </div>
                        <div className="font-medium text-orange-600">
                          ${request.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-gray-500">No pending requests</p>
                    <Link to="/request">
                      <Button variant="outline" className="mt-3">
                        Request Money
                      </Button>
                    </Link>
                  </div>
                )}
                
                {pendingRequests.length > 0 && (
                  <div className="mt-4 text-center">
                    <Link to="/request">
                      <Button variant="outline" size="sm">
                        View All Requests
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title="Deposit Money"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Deposit
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              min="1"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 mt-6">
          <Button
            variant="primary"
            onClick={handleDeposit}
            loading={loading}
            fullWidth
          >
            Deposit Funds
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsDepositModalOpen(false)}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;