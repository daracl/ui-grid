export const regions = ['서울', '부산', '대전'];

export const categories = ['음료', '식품'];

export function createExampleFields1() {
  return [
    {
      name: 'transaction',
      label: '거래 정보',
      children: [
        {
          name: 'classification',
          label: '판매 분류',
          children: [
            { name: 'region', label: '지역', width: 140 },
            { name: 'category', label: '분류', width: 140 },
          ],
        },
        { name: 'productInfo', label: '상품 정보', children: [{ name: 'product', label: '상품', width: 200 }] },
      ],
    },
    {
      name: 'sales',
      label: '판매 실적',
      children: [
        {
          name: 'volume',
          label: '판매 수량',
          children: [{ name: 'quantity', label: '수량', width: 140, renderer: { type: 'number' } }],
        },
        {
          name: 'revenue',
          label: '매출 합계',
          children: [{ name: 'amount', label: '금액', width: 160, renderer: { type: 'number' } }],
        },
      ],
    },
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
