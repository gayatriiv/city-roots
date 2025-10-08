import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

export const useAuthGuard = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

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
    // Redirect to home page after successful login
    setLocation('/');
  };

  return {
    showLoginModal,
    setShowLoginModal,
    requireAuth,
    handleLoginSuccess,
    isAuthenticated: !!user
  };
};
