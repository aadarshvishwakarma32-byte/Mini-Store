import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeContext.jsx';
import { Toaster } from 'sonner';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { WishlistProvider } from '../context/WishlistContext.jsx';
import App from './App.jsx';

function AppProviders() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
          <Toaster position="bottom-right" theme="system" />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default AppProviders;
