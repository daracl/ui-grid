export function createExampleFields1() {
  return [
    { name: 'category', label: '분류', width: 180 },
    { name: 'name', label: '상품명', width: 220 },
    { name: 'amount', label: '금액', width: 140, renderer: { type: 'number' } },
  ];
}

export function createExampleItems2() {
  return [
    { category: '음료', name: '녹차', amount: 3000 },
    { category: '음료', name: '커피', amount: 4500 },
    { category: '식품', name: '빵', amount: 2500 },
  ];
}
