import ProductCard from '../ProductCard'
import floweringPlantsImage from "@assets/generated_images/Flowering_plants_collection_5d058eb7.png";

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="flowering-rose-bush"
        name="Premium Rose Bush Collection"
        price={49.99}
        originalPrice={69.99}
        image={floweringPlantsImage}
        category="Flowering Plants"
        difficulty="Beginner"
        rating={4.5}
        reviewCount={124}
        inStock={true}
        isOnSale={true}
        description="Beautiful collection of hybrid roses perfect for beginners. Includes red, pink, and white varieties with full care instructions."
        onAddToCart={(id) => console.log('Added to cart:', id)}
        onViewDetails={(id) => console.log('View details:', id)}
        onToggleWishlist={(id, isWishlisted) => console.log('Wishlist toggled:', id, isWishlisted)}
      />
    </div>
  )
}