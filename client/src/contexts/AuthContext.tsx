import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { auth, RecaptchaVerifier as RecaptchaVerifierType } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<string>;
  verifyOTP: (verificationId: string, otp: string) => Promise<void>;
  sendEmailOTP: (email: string) => Promise<void>;
  verifyEmailOTP: (email: string, emailLink?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // Check for temporary user data
        const tempUser = localStorage.getItem('temp_user');
        if (tempUser) {
          try {
            const parsedUser = JSON.parse(tempUser);
            setUser(parsedUser);
          } catch (error) {
            localStorage.removeItem('temp_user');
          }
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      // Clear temporary user data
      localStorage.removeItem('temp_user');
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<string> => {
    try {
      // Create recaptcha verifier
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        }
      });

      // Send OTP to phone number
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult.verificationId;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const verifyOTP = async (verificationId: string, otp: string) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const sendEmailOTP = async (email: string) => {
    try {
      console.log(`Sending email link to ${email}`);
      
      // Configure the email link settings
      const actionCodeSettings = {
        // URL you want to redirect back to after the user clicks the link
        url: `${window.location.origin}/auth/callback?email=${encodeURIComponent(email)}`,
        // This must be true for the link to open in the app
        handleCodeInApp: true,
      };

      // Send the email link
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email for later use
      localStorage.setItem('emailForSignIn', email);
      
      console.log('Email link sent successfully! Check your inbox.');
      
    } catch (error: any) {
      console.error('Error sending email link:', error);
      throw new Error(error.message);
    }
  };

  const verifyEmailOTP = async (email: string, emailLink?: string) => {
    try {
      // If emailLink is provided, verify it with Firebase
      if (emailLink) {
        if (!isSignInWithEmailLink(auth, emailLink)) {
          throw new Error('Invalid email link');
        }

        // Get the email from localStorage
        const emailForSignIn = localStorage.getItem('emailForSignIn');
        if (!emailForSignIn || emailForSignIn !== email) {
          throw new Error('Email mismatch');
        }

        // Sign in with the email link
        await signInWithEmailLink(auth, email, emailLink);
        
        // Clean up
        localStorage.removeItem('emailForSignIn');
        
      } else {
        // Fallback for demo mode - accept 123456
        const demoOTP = '123456';
        const tempUser = {
          uid: `temp_${Date.now()}`,
          email: email,
          displayName: email.split('@')[0],
          emailVerified: true
        } as User;
        
        setUser(tempUser);
        localStorage.setItem('temp_user', JSON.stringify(tempUser));
      }
      
    } catch (error: any) {
      console.error('Error verifying email:', error);
      throw new Error(error.message);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOutUser,
    sendOTP,
    verifyOTP,
    sendEmailOTP,
    verifyEmailOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};