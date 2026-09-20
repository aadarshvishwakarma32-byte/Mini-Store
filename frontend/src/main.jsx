import { createRoot } from 'react-dom/client';
import './index.css';
import AppProviders from './app/AppProviders.jsx';
import ErrorBoundary from './app/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AppProviders />
  </ErrorBoundary>
);
