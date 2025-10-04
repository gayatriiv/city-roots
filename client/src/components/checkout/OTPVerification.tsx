import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, Shield } from "lucide-react";
import { CustomerData } from "@/pages/CheckoutPage";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useScroll } from "@/hooks/useScroll";

interface OTPVerificationProps {
  onVerified: (data: CustomerData) => void;
}

export default function OTPVerification({ onVerified }: OTPVerificationProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const { scrollToTop } = useScroll();

  // Mock OTP - in real app, this would come from server
  const [mockOTP] = useState('123456');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/customers/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      const data = await response.json();
      console.log('OTP sent:', data.otp); // For demo purposes
      
      setStep('otp');
      setResendTimer(60);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/customers/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone, 
          otp, 
          name: name || undefined, 
          email: email || undefined 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'OTP verification failed');
      }

      const data = await response.json();
      
      // Proceed with verification
      const customerData: CustomerData = {
        phone: data.customer.phone,
        name: data.customer.name,
        email: data.customer.email,
        isVerified: data.customer.isVerified
      };

      onVerified(customerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendTimer(60);
      setOtp('');
      
      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <div className="space-y-6">
        <div id="phone-input" className="text-center scroll-snap-start">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Enter Your Phone Number
          </h2>
          <p className="text-gray-600">
            We'll send you a verification code to confirm your identity
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phone">Mobile Number</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-l-none"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Full Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to receive SMS notifications for order updates
          </p>
        </div>

        {/* Demo Content to Show Scroll */}
        <div className="space-y-4 pt-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Verify Your Phone?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🔒 Secure Checkout</h4>
              <p className="text-sm text-blue-800">We verify your identity to ensure secure transactions and prevent fraud.</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📱 Order Updates</h4>
              <p className="text-sm text-green-800">Receive real-time SMS updates about your order status and delivery.</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🚚 Delivery Notifications</h4>
              <p className="text-sm text-purple-800">Get notified when your order is out for delivery and arrives.</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">💬 Customer Support</h4>
              <p className="text-sm text-orange-800">Easy contact for order assistance and support inquiries.</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">📋 What Happens Next?</h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Enter your 10-digit mobile number</li>
              <li>Receive a 6-digit OTP via SMS</li>
              <li>Verify your phone number</li>
              <li>Proceed to add your delivery address</li>
              <li>Complete your secure payment</li>
            </ol>
          </div>

          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => scrollToTop()}
              className="text-sm"
            >
              ↑ Scroll to Top
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div id="otp-verification" className="text-center scroll-snap-start">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Verify Your Phone
        </h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to <strong>+91 {phone}</strong>
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleOTPSubmit} className="space-y-4">
        <div>
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-widest"
            maxLength={6}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Demo OTP: <strong>{mockOTP}</strong>
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify & Continue
        </Button>
      </form>

      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-gray-500">
            Resend OTP in {resendTimer}s
          </p>
        ) : (
          <Button
            variant="ghost"
            onClick={handleResendOTP}
            disabled={loading}
            className="text-primary"
          >
            Resend OTP
          </Button>
        )}
      </div>

      {/* Demo Content to Show Scroll */}
      <div className="space-y-4 pt-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">OTP Verification Help</h3>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">💡 Demo OTP Code</h4>
          <p className="text-sm text-yellow-800">
            For demo purposes, use the OTP code: <strong className="text-lg">123456</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📱 Check Your SMS</h4>
            <p className="text-sm text-blue-800">Look for an SMS from City Roots with your 6-digit verification code.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">⏰ Code Expiry</h4>
            <p className="text-sm text-green-800">The OTP code is valid for 10 minutes after sending.</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">❌ Wrong Code?</h4>
            <p className="text-sm text-red-800">If you enter the wrong code 3 times, you'll need to request a new OTP.</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">🔄 Didn't Receive?</h4>
            <p className="text-sm text-purple-800">Check your spam folder or wait 60 seconds to resend the code.</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">🛡️ Security Features</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>One-time use verification code</li>
            <li>Automatic expiry after 10 minutes</li>
            <li>Rate limiting to prevent abuse</li>
            <li>Secure SMS delivery via trusted providers</li>
          </ul>
        </div>

        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => scrollToTop()}
            className="text-sm"
          >
            ↑ Scroll to Top
          </Button>
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
}
