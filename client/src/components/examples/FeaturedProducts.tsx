import FeaturedProducts from '../FeaturedProducts'

export default function FeaturedProductsExample() {
  return (
    <FeaturedProducts
      onProductClick={(id) => console.log('Product clicked:', id)}
      onAddToCart={(id) => console.log('Added to cart:', id)}
      onViewAll={() => console.log('View all clicked')}
    />
  )
}