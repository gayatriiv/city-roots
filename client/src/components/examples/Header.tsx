import Header from '../Header'

export default function HeaderExample() {
  return (
    <Header 
      cartItems={3} 
      onCartClick={() => console.log('Cart opened')}
      onSearchChange={(query) => console.log('Search:', query)}
    />
  )
}