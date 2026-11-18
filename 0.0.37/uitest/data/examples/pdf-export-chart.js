export const items = [
  { product: 'Tea', revenue: 4200, trend: [12, 16, 14, 21, 24, 27, 31] },
  { product: 'Coffee', revenue: 6800, trend: [18, 17, 22, 25, 23, 29, 34] },
  { product: 'Juice', revenue: 3900, trend: [20, 18, 16, 19, 21, 23, 25] },
  { product: 'Water', revenue: 2700, trend: [10, 12, 13, 11, 15, 16, 18] },
  { product: 'Soda', revenue: 5100, trend: [24, 22, 25, 21, 27, 28, 26] },
];

export function createExampleFields1() {
  return [
    { name: 'product', label: 'Product', width: 160 },
    {
      name: 'revenue',
      label: 'Revenue',
      width: 150,
      align: 'right',
      renderer: { type: 'bar', rule: { minimum: 0, maximum: 8000 } },
    },
    {
      name: 'trend',
      label: 'Weekly trend',
      width: 220,
      renderer: {
        type: 'sparklineBar',
        refValue: (_field, value) => ({ value }),
      },
    },
  ];
}
