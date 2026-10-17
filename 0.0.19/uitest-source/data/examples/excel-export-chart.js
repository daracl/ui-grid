export function createExampleFields1() {
  return [
    { name: 'product', label: '상품', width: 160 },
    {
      name: 'revenue',
      label: '매출 막대',
      width: 200,
      renderer: { type: 'bar', rule: { minimum: 0, maximum: 8000 } },
    },
    {
      name: 'trend',
      label: '주간 추이',
      width: 240,
      renderer: { type: 'sparkline', refValue: (_field, value) => ({ value }) },
    },
    {
      name: 'trendBars',
      label: '주간 막대',
      width: 240,
      renderer: { type: 'sparklineBar', refValue: (_field, value) => ({ value }) },
    },
  ];
}

export function createExampleItems2() {
  return [
    { product: '녹차', revenue: 4200, trend: [12, 16, 14, 21, 24], trendBars: [12, 16, 14, 21, 24] },
    { product: '커피', revenue: 6800, trend: [18, 17, 22, 25, 34], trendBars: [18, 17, 22, 25, 34] },
    { product: '주스', revenue: 3900, trend: [20, 18, 16, 23, 25], trendBars: [20, 18, 16, 23, 25] },
    { product: '생수', revenue: 2700, trend: [10, 12, 13, 16, 18], trendBars: [10, 12, 13, 16, 18] },
  ];
}
