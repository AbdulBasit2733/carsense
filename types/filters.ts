export interface CarFilterData {
  makes: string[];
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  priceRange: {
    min: number;
    max: number;
  };
}
