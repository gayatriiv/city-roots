import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, CreditCard, MapPin } from "lucide-react";
import Header from "@/components/Header";
import { useCart, Product } from "@/contexts/CartContext";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import ScrollToTop from "@/components/ui/ScrollToTop";

export type CheckoutStep = 'address' | 'payment' | 'confirmation';

export interface CustomerData {
  phone: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export interface AddressData {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface CheckoutPageProps {
  onAddToCart: (productId: string) => void;
}

export default function CheckoutPage({ onAddToCart }: CheckoutPageProps) {
  const [, setLocation] = useLocation();
  const { cartItems, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleBackClick = () => {
    setLocation('/cart');
  };

  const handleAddressSubmitted = (data: AddressData) => {
    // Extract customer data from address form
    const customerData: CustomerData = {
      phone: data.phone,
      name: data.fullName,
      email: '', // Will be filled in payment form if needed
      isVerified: true // Skip verification
    };
    
    setCustomerData(customerData);
    setAddressData(data);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = (orderId: string) => {
    setOrderId(orderId);
    setCurrentStep('confirmation');
    clearCart(); // Clear cart after successful payment
  };

  const getStepIcon = (step: CheckoutStep, currentStep: CheckoutStep) => {
    const isCompleted = getStepIndex(currentStep) > getStepIndex(step);
    const isCurrent = currentStep === step;
    
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    
    return (
      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
        isCurrent ? 'border-primary bg-primary text-white' : 'border-gray-300'
      }`}>
        {getStepIndex(step) + 1}
      </div>
    );
  };

  const getStepIndex = (step: CheckoutStep) => {
    const steps: CheckoutStep[] = ['address', 'payment', 'confirmation'];
    return steps.indexOf(step);
  };

  const getStepTitle = (step: CheckoutStep) => {
    switch (step) {
      case 'address': return 'Delivery Address';
      case 'payment': return 'Payment';
      case 'confirmation': return 'Order Confirmation';
      default: return '';
    }
  };

  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          cartItems={getTotalItems()}
          onCartClick={() => setLocation('/cart')}
          onSearchChange={() => {}}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to proceed to checkout!</p>
            <Button onClick={() => setLocation('/plants')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={getTotalItems()}
        onCartClick={() => setLocation('/cart')}
        onSearchChange={() => {}}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
              
              {/* Progress Steps */}
              <div className="hidden sm:flex items-center justify-between mb-8">
                {(['address', 'payment', 'confirmation'] as CheckoutStep[]).map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className="flex items-center">
                      {getStepIcon(step, currentStep)}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {getStepTitle(step)}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Mobile Progress Steps */}
              <div className="sm:hidden mb-6">
                <div className="flex items-center justify-between">
                  {(['address', 'payment', 'confirmation'] as CheckoutStep[]).map((step, index) => (
                    <div key={step} className="flex flex-col items-center">
                      {getStepIcon(step, currentStep)}
                      <span className="text-xs font-medium text-gray-900 mt-1 text-center">
                        {step === 'address' ? 'Address' : 
                         step === 'payment' ? 'Payment' : 'Confirm'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStep === 'address' && <MapPin className="h-5 w-5" />}
                  {currentStep === 'payment' && <CreditCard className="h-5 w-5" />}
                  {currentStep === 'confirmation' && <CheckCircle className="h-5 w-5" />}
                  {getStepTitle(currentStep)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 'address' && (
                  <div id="address-form" className="scroll-snap-start">
                    <AddressForm 
                      customerData={customerData || { phone: '', name: '', email: '', isVerified: true }}
                      onSubmit={handleAddressSubmitted}
                    />
                  </div>
                )}
                
                {currentStep === 'payment' && customerData && addressData && (
                  <div id="payment-form" className="scroll-snap-start">
                    <PaymentForm 
                      customerData={customerData}
                      addressData={addressData}
                      cartItems={cartItems}
                      onPaymentSuccess={handlePaymentSuccess}
                      onBack={() => setCurrentStep('address')}
                    />
                  </div>
                )}
                
                {currentStep === 'confirmation' && orderId && (
                  <div id="order-confirmation" className="scroll-snap-start">
                    <OrderConfirmation 
                      orderId={orderId}
                      customerData={customerData!}
                      addressData={addressData!}
                      onContinueShopping={() => setLocation('/plants')}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          {currentStep !== 'confirmation' && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="w-12 h-12 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (18%)</span>
                      <span>{formatPrice(getTotalPrice() * 0.18)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice() * 1.18)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
}
