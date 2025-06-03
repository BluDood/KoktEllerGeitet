import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import '@fontsource-variable/open-sans'
import '@fontsource/material-icons'
import { BrowserRouter } from 'react-router'
import { UserContextProvider } from './contexts/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
)
