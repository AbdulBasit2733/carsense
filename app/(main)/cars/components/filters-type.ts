// filter-types.ts

export interface PriceRange {
  min: number;
  max: number;
}

export interface Filters {
  makes: string[];
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  priceRange: PriceRange;
}

export interface CarFilterProps {
  filters: Filters;
}

export interface CurrentFilters {
  make: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  priceRangeMin: number
priceRangeMax: number

}

export type FilterName = keyof CurrentFilters;

export interface CarFilterControlsProps {
  filters: Filters;
  currentFilters: CurrentFilters;
  onFilterChange: (filterName: FilterName, value: any) => void;
  onClearFilter: (filterName: FilterName) => void;
}
