import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthGuard = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  const requireAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (callback: () => void) => {
    setShowLoginModal(false);
    callback();
  };

  return {
    showLoginModal,
    setShowLoginModal,
    requireAuth,
    handleLoginSuccess,
    isAuthenticated: !!user
  };
};
