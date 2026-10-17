export const regions = ['서울', '부산', '대전'];

export const categories = ['음료', '식품'];

export function createExampleFields1() {
  return [
    { name: 'region', label: '지역', width: 140 },
    { name: 'category', label: '분류', width: 140 },
    { name: 'product', label: '상품', width: 200 },
    { name: 'quantity', label: '수량', width: 140, renderer: { type: 'number' } },
    { name: 'amount', label: '금액', width: 160, renderer: { type: 'number' } },
  ];
}

export function createExampleItems2() {
  return Array.from({ length: 30 }, (_, index) => ({
    region: regions[Math.floor(index / 10)],
    category: categories[Math.floor((index % 10) / 5)],
    product: businessProduct(index % 5),
    quantity: (index % 5) + 1,
    amount: ((index % 5) + 1) * 1500,
  }));
}
