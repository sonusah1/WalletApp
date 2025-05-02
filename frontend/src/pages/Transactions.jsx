import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Filter, Download } from 'lucide-react';
import Navbar from '../Component/layout/Navbar';
import Footer from '../Component/layout/Footer';
import Card from '../Component/common/Card';
import Button from '../Component/common/Button';
import Loading from '../Component/common/Loading';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';

const Transactions = () => {
  const { user } = useAuth();
  const { getTransactionHistory } = useTransaction();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactionHistory();

        if (Array.isArray(data)) {
          setTransactions(data);
          setFilteredTransactions(data);
        } else if (data) {
          setTransactions([data]);
          setFilteredTransactions([data]);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, dateRange, transactions]);

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filter === 'sent') {
      filtered = filtered.filter(t => t.sender._id === user?._id);
    } else if (filter === 'received') {
      filtered = filtered.filter(t => t.receiver._id === user?._id);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (dateRange === 'today') {
        filtered = filtered.filter(t => new Date(t.createdAt) >= today);
      } else if (dateRange === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(t => new Date(t.createdAt) >= weekAgo);
      } else if (dateRange === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(t => new Date(t.createdAt) >= monthAgo);
      }
    }

    setFilteredTransactions(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const exportTransactions = () => {
    const headers = ['Transaction ID', 'Date', 'From/To', 'Amount', 'Status'];
    const rows = filteredTransactions.map((t) => {
      const isSender = t.sender._id === user?._id;
      const party = isSender ? t.receiver : t.sender;
      return [
        t.transactionId,
        formatDate(t.createdAt),
        isSender ? `To: ${party.name}` : `From: ${party.name}`,
        `${isSender ? '-' : '+'}$${t.amount.toFixed(2)}`,
        'Completed'
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  if (loading) {
    return <Loading fullScreen text="Loading transactions..." />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600">View your past transactions</p>
          </div>

          <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
                  >
                    <option value="all">All Transactions</option>
                    <option value="sent">Money Sent</option>
                    <option value="received">Money Received</option>
                  </select>
                  <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                  <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={exportTransactions}>
                <Download size={16} className="mr-2" /> Export
              </Button>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From/To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((t) => {
                      const isSender = t.sender._id === user?._id;
                      const party = isSender ? t.receiver : t.sender;

                      return (
                        <tr key={t._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isSender ? 'bg-red-100' : 'bg-green-100'}`}>
                                {isSender ? (
                                  <ArrowUp className="h-4 w-4 text-red-600" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{t.transactionType}</div>
                                <div className="text-sm text-gray-500">ID: {t.transactionId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(t.createdAt)}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{isSender ? `To: ${party.name}` : `From: ${party.name}`}</div>
                            <div className="text-sm text-gray-500">{party.email}</div>
                          </td>
                          <td className={`px-6 py-4 text-sm font-medium ${isSender ? 'text-red-600' : 'text-green-600'}`}>
                            {isSender ? '-' : '+'}${t.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Transactions;
