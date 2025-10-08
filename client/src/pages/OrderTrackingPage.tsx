import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Search } from "lucide-react";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ui/ScrollToTop";

interface TrackingEntry {
  id: string;
  status: string;
  message: string;
  location?: string;
  timestamp: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: string;
}

interface OrderTrackingData {
  order: OrderData;
  tracking: TrackingEntry[];
}

export default function OrderTrackingPage() {
  const [, setLocation] = useLocation();
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`/api/orders/tracking/${orderNumber}`);
      if (!response.ok) {
        throw new Error('Order not found');
      }
      const data = await response.json();
      setTrackingData(data);
    } catch (err) {
      setError('Order not found. Please check your order number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order_placed':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'payment_confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order_placed':
        return 'bg-blue-100 text-blue-800';
      case 'payment_confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(parseFloat(price));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={0}
        onCartClick={() => setLocation('/cart')}
        onSearchChange={() => {}}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your order number to track the status of your delivery
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter order number (e.g., VC123456789)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="text-center"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Track Order
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {trackingData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold">{trackingData.order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">{formatDate(trackingData.order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Status</p>
                    <Badge className={getStatusColor(trackingData.order.status)}>
                      {trackingData.order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <Badge className={trackingData.order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {trackingData.order.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(trackingData.order.total)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Tracking</CardTitle>
                <CardDescription>
                  Track the progress of your order from placement to delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.tracking.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getStatusIcon(entry.status)}
                        </div>
                        {index < trackingData.tracking.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {entry.message}
                          </h4>
                          <Badge className={getStatusColor(entry.status)}>
                            {entry.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        {entry.location && (
                          <p className="text-sm text-gray-600 mb-1">
                            📍 {entry.location}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-500">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Need Help?</p>
                  <p>
                    If you have any questions about your order or need assistance, 
                    please contact our customer support team at{' '}
                    <strong>+91 12345XXXX</strong> or email us at{' '}
                    <strong>help@cityroots.com</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <ScrollToTop />
    </div>
  );
}
