import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const TransactionContext = createContext(null);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendMoney = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/transaction/transfer-Amount', data);
      
      if (response.data.success) {
        toast.success('Money sent successfully');
        return response.data.data;
      }
    } catch (error) {
      console.error('Send money error:', error);
      toast.error(error.response?.data?.message || 'Failed to send money');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const depositMoney = async (amount) => {
    try {
      setLoading(true);
      const response = await api.post('/transaction/deposit', { amount });
      
      if (response.data.success) {
        toast.success(`$${amount} deposited successfully`);
        return response.data.data;
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error(error.response?.data?.message || 'Failed to deposit money');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyReceiver = async (receiverId) => {
    try {
      setLoading(true);
      const response = await api.get('/transaction/verifyReceiver', {
        params: { receiver: receiverId }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Verify receiver error:', error);
      toast.error(error.response?.data?.message || 'Failed to verify receiver');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestMoney = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/request/request-amount', data);
      
      if (response.data.success) {
        toast.success('Money request sent successfully');
        return response.data.data;
      }
    } catch (error) {
      console.error('Request money error:', error);
      toast.error(error.response?.data?.message || 'Failed to request money');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestData, status) => {
    try {
      setLoading(true);
      const data = {
        ...requestData,
        status,
        transactionType: 'Request',
        reference: 'Money request'
      };
      
      const response = await api.post('/request/update-request-status', data);
      
      if (response.data.success) {
        toast.success(`Request ${status.toLowerCase()} successfully`);
        return response.data.data;
      }
    } catch (error) {
      console.error('Handle request action error:', error);
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} request`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionHistory = async () => {
    try {
      setLoading(true);
      if (!user?._id) throw new Error('User not authenticated');
      
      const response = await api.get(`/transaction/getTransaction/${user._id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Get transaction history error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSentRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/request/request-send');
      
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Get sent requests error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getReceivedRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/request/request-received');
      
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Get received requests error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        sendMoney,
        depositMoney,
        verifyReceiver,
        requestMoney,
        handleRequestAction,
        getTransactionHistory,
        getSentRequests,
        getReceivedRequests,
        loading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
