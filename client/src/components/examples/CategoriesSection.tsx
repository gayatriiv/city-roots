import CategoriesSection from '../CategoriesSection'

export default function CategoriesSectionExample() {
  return (
    <CategoriesSection 
      onCategoryClick={(categoryId) => console.log('Category clicked:', categoryId)}
    />
  )
}