import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, Download, Share2 } from "lucide-react";
import { CustomerData, AddressData } from "@/pages/CheckoutPage";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useScroll } from "@/hooks/useScroll";
import { generateInvoicePDF, InvoiceData } from "@/utils/pdfGenerator";

interface OrderConfirmationProps {
  orderId: string;
  customerData: CustomerData;
  addressData: AddressData;
  orderData: {
    orderId: string;
    cartItems: Array<{
      product: {
        id: string;
        name: string;
        price: number;
      };
      quantity: number;
    }>;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    paymentData?: {
      paymentId: string;
      paymentMethod: string;
      orderNumber: string;
    };
  };
  onContinueShopping: () => void;
}

export default function OrderConfirmation({ 
  orderId, 
  customerData, 
  addressData, 
  orderData,
  onContinueShopping 
}: OrderConfirmationProps) {
  const orderNumber = orderData.paymentData?.orderNumber || `VC${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const [estimatedDelivery] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)); // 3 days from now
  const [trackingNumber] = useState(`TRK${Date.now().toString().slice(-8)}`);
  const { scrollToTop, scrollToElement } = useScroll();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadInvoice = () => {
    const invoiceData: InvoiceData = {
      orderNumber: orderNumber,
      orderDate: new Date().toLocaleDateString('en-IN'),
      customerName: customerData.name,
      customerPhone: customerData.phone,
      customerEmail: customerData.email || '',
      address: {
        fullName: addressData.fullName,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country
      },
      items: orderData.cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      })),
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      paymentMethod: orderData.paymentData?.paymentMethod || 'Razorpay',
      paymentId: orderData.paymentData?.paymentId || 'N/A'
    };

    generateInvoicePDF(invoiceData);
  };

  const handleShareOrder = () => {
    const shareText = `I just placed an order #${orderNumber} on VerdantCart! 🌱 Can't wait for my plants to arrive!`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'My VerdantCart Order',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Order details copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div id="order-success" className="text-center scroll-snap-start">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Order Confirmed! 🎉
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full">
          <Package className="h-4 w-4" />
          <span className="font-medium">Order #{orderNumber}</span>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => scrollToElement('order-status')}
          className="text-xs"
        >
          Order Status
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => scrollToElement('delivery-info')}
          className="text-xs"
        >
          Delivery Info
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => scrollToElement('contact-info')}
          className="text-xs"
        >
          Contact Info
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => scrollToElement('action-buttons')}
          className="text-xs"
        >
          Actions
        </Button>
      </div>

      {/* Order Status */}
      <Card id="order-status" className="scroll-snap-start">
        <CardHeader>
          <CardTitle className="text-lg">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Payment Confirmed</p>
                <p className="text-sm text-gray-600">Your payment has been processed successfully</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800">Order Processing</p>
                <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-600">Shipped</p>
                <p className="text-sm text-gray-500">Your order will be shipped soon</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card id="delivery-info" className="scroll-snap-start">
        <CardHeader>
          <CardTitle className="text-lg">Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Delivery Address</p>
              <p className="text-sm text-gray-600">
                {addressData.fullName}<br/>
                {addressData.addressLine1}<br/>
                {addressData.addressLine2 && `${addressData.addressLine2},`}<br/>
                {addressData.city}, {addressData.state} {addressData.postalCode}<br/>
                {addressData.country}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-sm">Estimated Delivery</p>
              <p className="text-lg font-semibold text-green-600">
                {formatDate(estimatedDelivery)}
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">Tracking Number</p>
              <p className="text-lg font-mono font-semibold">
                {trackingNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card id="contact-info" className="scroll-snap-start">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
          <CardDescription>
            We're here to assist you with your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-gray-600">+91 12345XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-gray-600">help@cityroots.com</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div id="action-buttons" className="flex flex-col sm:flex-row gap-4 scroll-snap-start">
        <Button
          onClick={onContinueShopping}
          className="flex-1"
        >
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadInvoice}
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>
        <Button
          variant="outline"
          onClick={handleShareOrder}
          className="flex-1"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Order
        </Button>
        <Button
          variant="outline"
          onClick={() => scrollToTop()}
          className="flex-1"
        >
          ↑ Back to Top
        </Button>
      </div>

      {/* Order Updates Notice */}
      <Card id="order-updates" className="bg-blue-50 border-blue-200 scroll-snap-start">
        <CardContent className="pt-4">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">📱 Order Updates</p>
            <p>
              You'll receive SMS updates at <strong>+91 {customerData.phone}</strong> and 
              {customerData.email && <span> email updates at <strong>{customerData.email}</strong></span>} 
              with real-time tracking information.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card id="next-steps" className="bg-green-50 border-green-200 scroll-snap-start">
        <CardContent className="pt-4">
          <div className="text-sm text-green-800">
            <p className="font-medium mb-2">🌱 What's Next?</p>
            <ul className="space-y-1">
              <li>• We'll send you a confirmation email within 5 minutes</li>
              <li>• Your order will be processed within 24 hours</li>
              <li>• You'll receive tracking updates via SMS</li>
              <li>• Delivery expected in 2-3 business days</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <ScrollToTop />
    </div>
  );
}
