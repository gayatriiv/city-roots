import Hero from '../Hero'

export default function HeroExample() {
  return (
    <Hero 
      onShopNow={() => console.log('Shop now clicked')}
      onLearnMore={() => console.log('Learn more clicked')}
    />
  )
}