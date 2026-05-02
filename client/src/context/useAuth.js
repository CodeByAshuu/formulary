import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Separated from AuthContext.jsx so that file only exports a component
// (AuthProvider), satisfying the react-refresh/only-export-components rule.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
