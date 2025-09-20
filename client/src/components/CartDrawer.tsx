import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    console.log(`Update quantity for ${id}: ${newQuantity}`); //todo: remove mock functionality
    onUpdateQuantity?.(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    console.log(`Remove item: ${id}`); //todo: remove mock functionality
    onRemoveItem?.(id);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    console.log('Starting checkout process'); //todo: remove mock functionality
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      onCheckout?.();
    }, 2000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md" data-testid="cart-drawer">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {items.length === 0 
              ? "Your cart is empty" 
              : `${items.length} item${items.length !== 1 ? 's' : ''} in your cart`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={onClose} data-testid="continue-shopping">
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4" data-testid="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-card rounded-lg" data-testid={`cart-item-${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm" data-testid={`item-name-${item.id}`}>
                        {item.name}
                      </h4>
                      <Badge variant="outline" className="text-xs" data-testid={`item-category-${item.id}`}>
                        {item.category}
                      </Badge>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary" data-testid={`item-price-${item.id}`}>
                          ${item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            data-testid={`decrease-quantity-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center" data-testid={`item-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            data-testid={`increase-quantity-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="space-y-2" data-testid="cart-summary">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span data-testid="subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span data-testid="shipping">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 50 && subtotal > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span data-testid="total">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  data-testid="checkout-button"
                >
                  {isCheckingOut ? 'Processing...' : `Checkout • $${total.toFixed(2)}`}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                  data-testid="continue-shopping"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}