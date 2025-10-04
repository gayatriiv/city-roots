import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { CustomerData, AddressData } from "@/pages/CheckoutPage";
import { useScroll } from "@/hooks/useScroll";
import { Product } from "@/contexts/CartContext";

interface PaymentFormProps {
  customerData: CustomerData;
  addressData: AddressData;
  cartItems: Array<{ product: Product; quantity: number }>;
  onPaymentSuccess: (orderId: string) => void;
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
  const { scrollToTop } = useScroll();

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
    setLoading(true);
    setError('');

    try {
      // Create order on server
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      
      // For demo purposes, simulate successful payment
      // In production, this would integrate with Razorpay
      setTimeout(() => {
        // Simulate payment processing
        console.log('Demo payment processing...');
        
        // Create mock payment response
        const mockPaymentResponse = {
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_signature: `mock_signature_${Date.now()}`
        };

        // Verify payment on server
        handlePaymentVerification(mockPaymentResponse, orderData);
      }, 2000);

    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (paymentResponse: any, orderData: any) => {
    try {
      const verificationResponse = await fetch('/api/orders/verify-payment', {
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
            orderNumber: orderData.order.orderNumber
          }
        }),
      });

      const result = await verificationResponse.json();
      
      if (result.success) {
        onPaymentSuccess(result.orderId);
      } else {
        setError('Payment verification failed. Please try again.');
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
            Demo mode - Payment simulation for testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Demo Payment Gateway</p>
              <p className="text-sm text-green-700">Simulated payment processing</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">Demo Mode</Badge>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-sm text-green-700">
            <Shield className="h-4 w-4" />
            <span>This is a demo payment - no real money will be charged</span>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Instructions:</strong> Click "Pay Now" to simulate a successful payment. 
              The payment will be processed automatically after 2 seconds.
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
          disabled={loading}
          className="flex-1"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Processing Payment...' : 'Pay Now (Demo)'}
        </Button>
      </div>

      {/* Security Notice */}
      <Card id="security-notice" className="bg-green-50 border-green-200 scroll-snap-start">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Demo Payment System</p>
              <p>
                This is a demonstration payment system. No real money will be charged. 
                In production, this would integrate with secure payment gateways like Razorpay.
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
          <h4 className="font-medium text-yellow-900 mb-2">💡 Demo Payment Mode</h4>
          <p className="text-sm text-yellow-800">
            This is a demonstration payment system. No real money will be charged. 
            Click "Pay Now (Demo)" to simulate a successful payment and proceed to order confirmation.
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
