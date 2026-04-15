import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#13131A', color: '#F1F1F1', border: '1px solid #1E1E2E' },
          success: { iconTheme: { primary: '#C0392B', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
