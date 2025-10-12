export function getColor(value: number): { color: string; icon: string } {
  if (value == null) {
    return {
      color: '#C4C4C4',
      icon: '/assets/advisors/rating-1.svg',
    };
  }
  if (value >= 40 && value <= 60) {
    return {
      color: '#E3BE30',
      icon: '/assets/advisors/rating-2.svg',
    };
  }
  if (value > 90) {
    return { color: '#00C67E', icon: '/assets/advisors/rating-6.svg' };
  }
  if (value > 80) {
    return { color: '#72D4BB', icon: '/assets/advisors/rating-5.svg' };
  }
  if (value > 70) {
    return { color: '#B5D472', icon: '/assets/advisors/rating-4.svg' };
  }
  if (value > 60) {
    return { color: '#D6D959', icon: '/assets/advisors/rating-3.svg' };
  }
  if (value < 10) {
    return { color: '#D9593C', icon: '/assets/advisors/rating-11.svg' };
  }
  if (value < 20) {
    return { color: '#E78961', icon: '/assets/advisors/rating-10.svg' };
  }
  if (value < 30) {
    return { color: '#D19F70', icon: '/assets/advisors/rating-9.svg' };
  }
  if (value < 40) {
    return { color: '#E0BC76', icon: '/assets/advisors/rating-8.svg' };
  }
}
