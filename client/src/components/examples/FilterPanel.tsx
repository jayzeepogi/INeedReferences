import FilterPanel, { Filters } from '../FilterPanel';
import { useState } from 'react';

export default function FilterPanelExample() {
  const [filters, setFilters] = useState<Filters>({
    yearFrom: 'any',
    yearTo: 'any',
    field: 'all',
    publicationType: 'all',
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    console.log('Filter changed:', key, value);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
    </div>
  );
}
