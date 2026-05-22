import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import VinosPage from './pages/VinosPage.tsx'
import VinoDetailPage from './pages/VinoDetailPage.tsx'
import { CartProvider } from './context/CartContext.tsx'
import CartDrawer from './components/CartDrawer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/vinos" element={<VinosPage />} />
          <Route path="/vinos/:id" element={<VinoDetailPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
