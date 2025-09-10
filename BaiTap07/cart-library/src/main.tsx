import { StrictMode } from 'react'
import { CartProvider } from './components/Cart/hook/CartContext'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <CartProvider>
    <App />
  </CartProvider>,
)
