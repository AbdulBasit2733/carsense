export const serializedCarData = (car) => ({
  ...car,
  price: car.price ? parseFloat(car.price.toString()) : 0, // fallback if undefined
  createdAt: car.createdAt?.toISOString?.() || "",
  updatedAt: car.updatedAt?.toISOString?.() || "",
});
