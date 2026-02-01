/**
 * Hook for calculating route pricing based on business rules:
 * - Fixed price ranges by number of stops:
 *   - 3-5 stops: 9.90€
 *   - 6-8 stops: 14.90€
 *   - 9+ stops: 19.90€
 * - Group discounts:
 *   - 4-6 people: 10% discount
 *   - 7+ people: 20% discount
 */

export interface RoutePricing {
  basePrice: number;
  pricePerPerson: number;
  discountPercent: number;
  totalPrice: number;
  numPeople: number;
  stopCount: number;
}

export const getBasePriceByStops = (stopCount: number): number => {
  if (stopCount <= 5) return 9.90;
  if (stopCount <= 8) return 14.90;
  return 19.90;
};

export const getGroupDiscountPercent = (numPeople: number): number => {
  if (numPeople >= 7) return 20;
  if (numPeople >= 4) return 10;
  return 0;
};

export const calculateRoutePricing = (
  stopCount: number,
  numPeople: number
): RoutePricing => {
  const basePrice = getBasePriceByStops(stopCount);
  const discountPercent = getGroupDiscountPercent(numPeople);
  const pricePerPerson = basePrice * (1 - discountPercent / 100);
  const totalPrice = pricePerPerson * numPeople;

  return {
    basePrice,
    pricePerPerson: Math.round(pricePerPerson * 100) / 100,
    discountPercent,
    totalPrice: Math.round(totalPrice * 100) / 100,
    numPeople,
    stopCount,
  };
};

export const formatPrice = (price: number): string => {
  return price.toFixed(2).replace('.', ',') + ' €';
};
