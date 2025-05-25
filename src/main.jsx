import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { createTheme } from '@mui/material/styles';
import theme from './components/Theme.js'
import { ThemeProvider } from '@mui/material/styles';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthContextProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
        <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthContextProvider>

  </StrictMode>,
)
