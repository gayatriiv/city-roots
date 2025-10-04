import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { CustomerData, AddressData } from "@/pages/CheckoutPage";
import { Product } from "@/contexts/CartContext";

interface PaymentFormProps {
  customerData: CustomerData;
  addressData: AddressData;
  cartItems: Array<{ product: Product; quantity: number }>;
  onPaymentSuccess: (orderId: string) => void;
  onBack: () => void;
}

// Mock Razorpay integration
declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load payment gateway. Please refresh and try again.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VC${timestamp}${random}`;
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError('Payment gateway is still loading. Please wait a moment.');
      return;
    }

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
      
      // Prepare Razorpay order response
      const razorpayOrderResponse = {
        id: orderData.order.id,
        amount: Math.round(total * 100), // Razorpay expects amount in paise
        currency: 'INR',
        receipt: orderData.order.orderNumber,
        notes: {
          customer_phone: customerData.phone,
          customer_email: customerData.email || '',
          customer_name: customerData.name,
          address: `${addressData.addressLine1}, ${addressData.city}, ${addressData.state} ${addressData.postalCode}`
        }
      };

      // Razorpay options
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Test key - replace with your actual key
        amount: razorpayOrderResponse.amount,
        currency: razorpayOrderResponse.currency,
        name: 'VerdantCart',
        description: `Order #${orderData.order.orderNumber}`,
        image: '/logo.png',
        order_id: razorpayOrderResponse.id,
        handler: async function (response: any) {
          try {
            // Verify payment on server
            const verificationResponse = await fetch('/api/orders/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  customerData,
                  addressData,
                  cartItems,
                  subtotal,
                  tax,
                  shipping,
                  total,
                  orderNumber
                }
              }),
            });

            const result = await verificationResponse.json();
            
            if (result.success) {
              onPaymentSuccess(result.orderId);
            } else {
              setError('Payment verification failed. Please try again.');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: customerData.name,
          email: customerData.email || '',
          contact: customerData.phone,
        },
        notes: razorpayOrderResponse.notes,
        theme: {
          color: '#059669',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
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
      <Card>
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
      <Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
          <CardDescription>
            Secure payment powered by Razorpay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Credit/Debit Card, UPI, Net Banking</p>
              <p className="text-sm text-gray-600">Powered by Razorpay</p>
            </div>
            <Badge variant="secondary">Recommended</Badge>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
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
          {razorpayLoaded ? 'Pay Now' : 'Loading...'}
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Secure Payment Guarantee</p>
              <p>
                Your payment is processed securely through Razorpay. We never store your card details. 
                All transactions are encrypted and PCI DSS compliant.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
