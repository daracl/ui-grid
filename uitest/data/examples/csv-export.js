export const fields = [
  { name: 'category', label: '분류', width: 160 },
  { name: 'name', label: '이름', width: 200 },
  { name: 'amount', label: '금액', width: 200, renderer: { type: 'number' } },
  { name: 'note', label: '숨김 메모', hidden: true },
];

export function createCsvExampleItems() {
  return Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    category: index < 6 ? '온라인 판매' : '매장 판매',
    name: businessProduct(index),
    amount: (index + 1) * 1000,
    note: businessNote(index),
  }));
}
