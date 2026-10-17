export const countries = ['Korea', 'Japan', 'USA'];

export const categories = ['Beverages', 'Food'];

export const items = Array.from({ length: 30 }, (_, index) => {
  const quantity = (index % 5) + 1;
  const unitPrice = 1200 + (index % 5) * 350;
  const amount = quantity * unitPrice;
  const cost = quantity * (800 + (index % 5) * 200);
  return {
    id: index + 1,
    country: countries[Math.floor(index / 10)],
    category: categories[Math.floor((index % 10) / 5)],
    product: businessProduct(index % 5),
    quantity,
    unitPrice,
    amount,
    cost,
    profit: amount - cost,
  };
});

export function createExampleFields1() {
  return [
    {
      name: 'transaction',
      label: '거래 정보',
      children: [
        {
          name: 'classification',
          label: '거래 분류',
          children: [
            { name: 'country', label: '국가', width: 110 },
            { name: 'category', label: '상품 분류', width: 120 },
          ],
        },
        { name: 'productInfo', label: '상품 정보', children: [{ name: 'product', label: '상품명', width: 200 }] },
      ],
    },
    {
      name: 'sales',
      label: '판매 실적',
      children: [
        {
          name: 'pricing',
          label: '수량·단가',
          children: [
            { name: 'quantity', label: '판매 수량', width: 100, align: 'right', renderer: { type: 'number' } },
            { name: 'unitPrice', label: '판매 단가', width: 120, align: 'right', renderer: { type: 'number' } },
          ],
        },
        {
          name: 'financials',
          label: '매출·수익',
          children: [
            { name: 'amount', label: '매출액', width: 130, align: 'right', renderer: { type: 'number' } },
            { name: 'cost', label: '매출 원가', width: 130, align: 'right', renderer: { type: 'number' } },
            { name: 'profit', label: '매출 이익', width: 130, align: 'right', renderer: { type: 'number' } },
          ],
        },
      ],
    },
  ];
}
