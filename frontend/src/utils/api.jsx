import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Wrap response in a standardized format
    return {
      ...response,
      data: {
        success: true,
        data: response.data.data,
        message: response.data.message,
      },
    };
  },
  (error) => {
    // Check if error.response is available
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
    console.error('API Error:', errorMessage);
    
    // Handle specific error cases (e.g., network error, server error)
    if (!error.response) {
      return Promise.reject(new Error('Network error or no response received.'));
    }

    if (error.response.status >= 500) {
      return Promise.reject(new Error('Server error occurred.'));
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
