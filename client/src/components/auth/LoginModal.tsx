import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Phone, Chrome, ArrowLeft, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMethod = 'email' | 'google' | 'otp' | 'email-otp';

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    sendOTP, 
    verifyOTP,
    sendEmailOTP,
    verifyEmailOTP
  } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email, password);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signUpWithEmail(email, password);
      setError('Account created! Please check your email for verification.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMethod === 'otp') {
        const vid = await sendOTP(phoneNumber);
        setVerificationId(vid);
        setOtpSent(true);
      } else if (authMethod === 'email-otp') {
        await sendEmailOTP(email);
        setOtpSent(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMethod === 'otp') {
        await verifyOTP(verificationId, otp);
      } else if (authMethod === 'email-otp') {
        await verifyEmailOTP(email, otp);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setOtp('');
    setVerificationId('');
    setError('');
    setOtpSent(false);
  };

  const handleMethodChange = (method: AuthMethod) => {
    setAuthMethod(method);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            Welcome to City Roots
          </DialogTitle>
          <p className="text-center text-gray-600">
            Sign in to add items to your cart and track your orders
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Auth Method Selection */}
          <div className="flex space-x-2">
            <Button
              variant={authMethod === 'email' ? 'default' : 'outline'}
              onClick={() => handleMethodChange('email')}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant={authMethod === 'google' ? 'default' : 'outline'}
              onClick={() => handleMethodChange('google')}
              className="flex-1"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            <Button
              variant={authMethod === 'email-otp' ? 'default' : 'outline'}
              onClick={() => handleMethodChange('email-otp')}
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-2" />
              OTP
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Email/Password Login */}
          {authMethod === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sign in with Email</CardTitle>
                <CardDescription>
                  Enter your email and password to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Sign In
                  </Button>
                </form>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Don't have an account?</p>
                  <Button
                    variant="link"
                    onClick={handleEmailSignup}
                    disabled={loading}
                  >
                    Create Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Google Sign In */}
          {authMethod === 'google' && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Email OTP */}
          {authMethod === 'email-otp' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {otpSent ? 'Verify OTP' : 'Sign in with OTP'}
                </CardTitle>
                <CardDescription>
                  {otpSent 
                    ? `Enter the 6-digit code sent to ${email}`
                    : 'Enter your email to receive a verification code'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <Label htmlFor="otp-email">Email</Label>
                      <Input
                        id="otp-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Send OTP
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Check Your Email</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        We've sent a sign-in link to <strong>{email}</strong>
                      </p>
                      <p className="text-xs text-gray-500">
                        Click the link in your email to sign in. The link will open this page and automatically log you in.
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setOtpSent(false);
                          resetForm();
                        }}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSendOTP}
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Resend Link
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        For demo purposes, you can also enter <code className="bg-gray-100 px-1 rounded">123456</code> below:
                      </p>
                      <div className="mt-2">
                        <Input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          className="text-center"
                        />
                        <Button
                          type="button"
                          onClick={() => handleVerifyOTP({ preventDefault: () => {} } as any)}
                          className="w-full mt-2"
                          disabled={loading || otp.length !== 6}
                        >
                          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Verify Demo Code
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* reCAPTCHA container for phone auth */}
        <div id="recaptcha-container"></div>
      </DialogContent>
    </Dialog>
  );
}
