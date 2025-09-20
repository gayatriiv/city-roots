import GuidesSection from '../GuidesSection'

export default function GuidesSectionExample() {
  return (
    <GuidesSection
      onGuideClick={(id) => console.log('Guide clicked:', id)}
      onViewAllGuides={() => console.log('View all guides clicked')}
    />
  )
}