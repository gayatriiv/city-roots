import { useState } from 'react'
import CartDrawer from '../CartDrawer'
import { Button } from "@/components/ui/button";
import floweringPlantsImage from "@assets/generated_images/Flowering_plants_collection_5d058eb7.png";
import gardeningToolsImage from "@assets/generated_images/Gardening_tools_collection_9c82fa3c.png";

export default function CartDrawerExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([
    {
      id: "1",
      name: "Premium Rose Bush Collection",
      price: 49.99,
      image: floweringPlantsImage,
      quantity: 2,
      category: "Flowering Plants"
    },
    {
      id: "2", 
      name: "Professional Tool Set",
      price: 89.99,
      image: gardeningToolsImage,
      quantity: 1,
      category: "Tools"
    }
  ]);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        Open Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
      </Button>
      
      <CartDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onUpdateQuantity={(id, quantity) => {
          setItems(items.map(item => 
            item.id === id ? { ...item, quantity } : item
          ));
        }}
        onRemoveItem={(id) => {
          setItems(items.filter(item => item.id !== id));
        }}
        onCheckout={() => {
          console.log('Checkout completed');
          setIsOpen(false);
        }}
      />
    </div>
  )
}