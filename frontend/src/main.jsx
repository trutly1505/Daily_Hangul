import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@lottiefiles/dotlottie-wc'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UiLanguageProvider } from './context/UiLanguageContext.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UiLanguageProvider>
          <App />
        </UiLanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
