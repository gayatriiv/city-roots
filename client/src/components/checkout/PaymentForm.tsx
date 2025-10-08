import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { CustomerData, AddressData } from "@/pages/CheckoutPage";
import { useScroll } from "@/hooks/useScroll";
import { Product } from "@/contexts/CartContext";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentFormProps {
  customerData: CustomerData;
  addressData: AddressData;
  cartItems: Array<{ product: Product; quantity: number }>;
  onPaymentSuccess: (orderId: string, paymentData?: any) => void;
  onBack: () => void;
}

// Demo payment integration

export default function PaymentForm({ 
  customerData, 
  addressData, 
  cartItems, 
  onPaymentSuccess, 
  onBack 
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { scrollToTop } = useScroll();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setError('Failed to load payment gateway');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VC${timestamp}${random}`;
  };

  const handlePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      setError('Payment gateway is not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create Razorpay order on server
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to paise
          currency: 'INR',
          customerData,
          addressData,
          cartItems,
          subtotal,
          tax,
          shipping,
          total
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const { order, orderData } = await orderResponse.json();

      // Razorpay options
      const options = {
        key: 'rzp_test_RQwJgLfJAHNwut', // Real Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: 'City Roots',
        description: `Order #${orderData.orderNumber}`,
        order_id: order.id,
        handler: function (response: any) {
          // Payment successful
          handlePaymentVerification(response, orderData);
        },
        prefill: {
          name: customerData.name,
          email: customerData.email || `${customerData.phone}@example.com`,
          contact: `+91${customerData.phone}`,
        },
        notes: {
          address: `${addressData.fullName}, ${addressData.addressLine1}, ${addressData.city}, ${addressData.state} ${addressData.postalCode}`,
          order_number: orderData.orderNumber,
        },
        theme: {
          color: '#059669', // Green theme to match City Roots branding
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setLoading(false);
      });
      
      razorpay.open();

    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (paymentResponse: any, orderData: any) => {
    try {
        console.log('Payment verification data:', {
          paymentResponse,
          orderData,
          orderNumber: orderData.order.orderNumber,
          orderId: orderData.order.id
        });

      const verificationResponse = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          orderData: {
            customerData,
            addressData,
            cartItems,
            subtotal,
            tax,
            shipping,
            total,
            orderNumber: orderData.order.orderNumber,
            orderId: orderData.order.id
          }
        }),
      });

      const result = await verificationResponse.json();
      console.log('Payment verification response:', result);
      
      if (result.success) {
        console.log('Payment successful, redirecting to confirmation');
        onPaymentSuccess(result.orderId, {
          paymentId: paymentResponse.razorpay_payment_id,
          paymentMethod: 'Razorpay',
          orderNumber: orderData.order.orderNumber
        });
      } else {
        console.error('Payment verification failed:', result.error);
        setError(`Payment verification failed: ${result.error || 'Please try again.'}`);
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Payment verification failed. Please contact support.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div id="payment-header" className="text-center scroll-snap-start">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment
        </h2>
        <p className="text-gray-600">
          Complete your purchase securely
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Order Summary */}
      <Card id="order-summary" className="scroll-snap-start">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (18%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card id="delivery-address" className="scroll-snap-start">
        <CardHeader>
          <CardTitle className="text-lg">Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <p className="font-medium">{addressData.fullName}</p>
            <p>{addressData.addressLine1}</p>
            {addressData.addressLine2 && <p>{addressData.addressLine2}</p>}
            <p>{addressData.city}, {addressData.state} {addressData.postalCode}</p>
            <p>{addressData.country}</p>
            <p className="text-gray-600">Phone: +91 {addressData.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card id="payment-method" className="scroll-snap-start">
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
          <CardDescription>
            Secure payment powered by Razorpay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Razorpay Payment Gateway</p>
              <p className="text-sm text-green-700">Secure payment processing</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">Secure</Badge>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-sm text-green-700">
            <Shield className="h-4 w-4" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Payment Options:</strong> Credit/Debit Cards, UPI, Net Banking, Digital Wallets
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div id="payment-actions" className="flex gap-4 scroll-snap-start">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Address
        </Button>
        <Button
          onClick={handlePayment}
          disabled={loading || !razorpayLoaded}
          className="flex-1"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Processing Payment...' : 'Pay Now'}
        </Button>
      </div>

      {/* Security Notice */}
      <Card id="security-notice" className="bg-green-50 border-green-200 scroll-snap-start">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Secure Payment Gateway</p>
              <p>
                Your payment is processed securely through Razorpay. 
                We never store your payment details on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Content to Show Scroll */}
      <div className="space-y-4 pt-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Security & Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🔒 Secure Payment</h4>
            <p className="text-sm text-green-800">All payments are processed through secure, encrypted channels with PCI DSS compliance.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💳 Multiple Payment Options</h4>
            <p className="text-sm text-blue-800">Pay using credit/debit cards, UPI, net banking, or digital wallets.</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">🛡️ Fraud Protection</h4>
            <p className="text-sm text-purple-800">Advanced fraud detection systems protect your transactions and personal information.</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">📱 Instant Confirmation</h4>
            <p className="text-sm text-orange-800">Receive instant payment confirmation via SMS and email after successful transaction.</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">💰 Payment Methods Accepted</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Credit/Debit Cards:</strong> Visa, Mastercard, American Express</p>
            <p><strong>UPI:</strong> Google Pay, PhonePe, Paytm, BHIM</p>
            <p><strong>Net Banking:</strong> All major Indian banks</p>
            <p><strong>Digital Wallets:</strong> Paytm, MobiKwik, FreeCharge</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">💳 Test Payment Mode</h4>
          <p className="text-sm text-yellow-800">
            This is a test environment. Use test card numbers for payment testing. 
            No real money will be charged in test mode.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📞 Need Help?</h4>
          <p className="text-sm text-blue-800">
            If you encounter any payment issues, contact our support team at 
            <strong> +91 98765 43210</strong> or email us at 
            <strong> support@verdantcart.com</strong>
          </p>
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
