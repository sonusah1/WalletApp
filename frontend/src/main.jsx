import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { TransactionProvider } from './context/TransactionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      <AuthProvider>
        <TransactionProvider>
          <App />
          <ToastContainer />
        </TransactionProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
