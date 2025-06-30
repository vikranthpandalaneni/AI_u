import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuthStore } from './stores/authStore.ts';

// Initialize theme on app start
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme-storage');
  if (savedTheme) {
    try {
      const { state } = JSON.parse(savedTheme);
      const theme = state?.theme || 'system';
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    } catch (error) {
      console.error('Failed to initialize theme:', error);
    }
  }
};

// Initialize auth immediately
const initializeAuth = () => {
  useAuthStore.getState().initialize();
};

initializeTheme();
initializeAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);