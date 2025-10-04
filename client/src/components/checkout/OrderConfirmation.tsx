import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, Download, Share2 } from "lucide-react";
import { CustomerData, AddressData } from "@/pages/CheckoutPage";

interface OrderConfirmationProps {
  orderId: string;
  customerData: CustomerData;
  addressData: AddressData;
  onContinueShopping: () => void;
}

export default function OrderConfirmation({ 
  orderId, 
  customerData, 
  addressData, 
  onContinueShopping 
}: OrderConfirmationProps) {
  const [orderNumber] = useState(`VC${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
  const [estimatedDelivery] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)); // 3 days from now
  const [trackingNumber] = useState(`TRK${Date.now().toString().slice(-8)}`);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download an actual invoice
    const invoiceContent = `
VERDANTCART - INVOICE
Order Number: ${orderNumber}
Order Date: ${new Date().toLocaleDateString('en-IN')}
Customer: ${customerData.name}
Phone: +91 ${customerData.phone}
Email: ${customerData.email || 'N/A'}

Delivery Address:
${addressData.fullName}
${addressData.addressLine1}
${addressData.addressLine2 || ''}
${addressData.city}, ${addressData.state} ${addressData.postalCode}
${addressData.country}

Estimated Delivery: ${formatDate(estimatedDelivery)}
Tracking Number: ${trackingNumber}

Thank you for your order!
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div className="text-center">
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

      {/* Order Status */}
      <Card>
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
      <Card>
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
      <Card>
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
                <p className="text-sm text-gray-600">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-gray-600">support@verdantcart.com</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>

      {/* Order Updates Notice */}
      <Card className="bg-blue-50 border-blue-200">
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
      <Card className="bg-green-50 border-green-200">
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
    </div>
  );
}
