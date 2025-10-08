import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, User, Mail } from "lucide-react";
import { CustomerData, AddressData } from "@/pages/CheckoutPage";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useScroll } from "@/hooks/useScroll";

interface AddressFormProps {
  customerData?: CustomerData | null;
  onSubmit: (data: AddressData) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

export default function AddressForm({ customerData, onSubmit }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressData>({
    fullName: customerData?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: customerData?.phone || ''
  });
  
  const [email, setEmail] = useState(customerData?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { scrollToTop } = useScroll();

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    const requiredFields: (keyof AddressData)[] = ['fullName', 'addressLine1', 'city', 'state', 'postalCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    // Validate postal code (Indian PIN codes are 6 digits)
    const postalCodeRegex = /^[1-9][0-9]{5}$/;
    if (!postalCodeRegex.test(formData.postalCode)) {
      setError('Please enter a valid 6-digit PIN code');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call to save address
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Include email in the form data
      onSubmit({ ...formData, email });
    } catch (err) {
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div id="address-header" className="text-center scroll-snap-start">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Delivery Address
        </h2>
        <p className="text-gray-600">
          Where should we deliver your order?
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form id="address-form-fields" onSubmit={handleSubmit} className="space-y-4 scroll-snap-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="addressLine1">Address Line 1 *</Label>
            <Input
              id="addressLine1"
              type="text"
              placeholder="House/Flat No., Building Name, Street"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input
              id="addressLine2"
              type="text"
              placeholder="Area, Locality, Landmark"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              type="text"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="postalCode">PIN Code *</Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="110001"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="1234567890"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="rounded-l-none"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address (Optional)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              We'll send order updates and invoice to this email
            </p>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              disabled
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to Payment
          </Button>
        </div>
      </form>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-800">Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-blue-700">
            • Free delivery on all orders<br/>
            • 2-3 business days delivery<br/>
            • Cash on delivery available<br/>
            • Live tracking updates via SMS
          </CardDescription>
        </CardContent>
      </Card>

      {/* Demo Content to Show Scroll */}
      <div className="space-y-4 pt-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🚚 Free Delivery</h4>
            <p className="text-sm text-green-800">Enjoy free delivery on all orders above ₹500 across India.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📦 Safe Packaging</h4>
            <p className="text-sm text-blue-800">Your plants are carefully packaged to ensure they arrive in perfect condition.</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">⏰ Fast Delivery</h4>
            <p className="text-sm text-purple-800">Most orders are delivered within 2-3 business days in metro cities.</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">🔄 Easy Returns</h4>
            <p className="text-sm text-orange-800">Not satisfied? We offer easy returns within 7 days of delivery.</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">📍 Delivery Areas</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Metro Cities:</strong> 1-2 business days</p>
            <p><strong>Tier 1 Cities:</strong> 2-3 business days</p>
            <p><strong>Tier 2 Cities:</strong> 3-5 business days</p>
            <p><strong>Remote Areas:</strong> 5-7 business days</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important Notes</h4>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>Please provide a complete and accurate address</li>
            <li>Include landmarks or directions if your location is hard to find</li>
            <li>Ensure someone is available to receive the package</li>
            <li>We'll call you before delivery to confirm availability</li>
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
