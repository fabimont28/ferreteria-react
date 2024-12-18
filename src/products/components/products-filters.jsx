import { Label, Select, TextInput } from 'flowbite-react'
import { RiSearchLine } from 'react-icons/ri'

export function ProductsFilters({ onUpdateFilters, filters, categories }) {
  return (
    <div className='flex items-center justify-between px-2 py-3'>
      <div className='grid grid-cols-4 gap-4'>
        <TextInput
          value={filters.search}
          onChange={(e) => onUpdateFilters({ search: e.target.value })}
          sizing='sm'
          placeholder='Buscar productos'
          rightIcon={RiSearchLine}
        />

        {categories.length > 0 ? (
          <Select
            sizing='sm'
            value={filters.category}
            onChange={(e) => onUpdateFilters({ category: e.target.value })}
          >
            <option value=''>Todas las categorías</option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </Select>
        ) : (
          <div className='h-7 w-full rounded-lg bg-neutral-200' />
        )}

        <Label className='inline-flex items-center gap-2'>
          Mínimo
          <TextInput
            addon='C$'
            value={filters.minPrice}
            onChange={(e) => onUpdateFilters({ minPrice: e.target.value })}
            type='number'
            sizing='sm'
            placeholder='Precio mínimo'
          />
        </Label>

        <Label className='inline-flex items-center gap-2'>
          Máximo
          <TextInput
            addon='C$'
            value={filters.maxPrice}
            onChange={(e) => onUpdateFilters({ maxPrice: e.target.value })}
            type='number'
            sizing='sm'
            placeholder='Precio máximo'
          />
        </Label>
      </div>
    </div>
  )
}
