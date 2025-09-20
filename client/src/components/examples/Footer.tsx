import Footer from '../Footer'

export default function FooterExample() {
  return (
    <Footer
      onNewsletterSignup={(email) => console.log('Newsletter signup:', email)}
      onNavigate={(section) => console.log('Navigate to:', section)}
    />
  )
}