import { useContext, createContext } from 'react';

// The context instance lives here (a plain .js file) so AuthContext.jsx can
// export only the AuthProvider component, satisfying react-refresh/only-export-components.
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
