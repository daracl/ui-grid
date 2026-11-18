export const countries = ['Korea', 'Japan', 'USA', 'Italy'];

export const products = ['Tea', 'Coffee', 'Phone', 'Tablet'];

export const names = ['Green tea', 'Black tea', 'Americano', 'Latte', 'Matcha', 'Galaxy S25'];

export const items = Array.from({ length: 100 }, (_, index) => {
  const quantity = (index % 9) + 1;
  return {
    id: index + 1,
    country: countries[Math.floor(index / 25)],
    product: products[Math.floor((index % 25) / 5) % products.length],
    name: names[index % names.length],
    quantity,
    amount: quantity * 1000 + index * 250,
  };
});

export function createExampleFields1() {
  return [
    { name: 'country', label: 'Country', width: 140 },
    { name: 'product', label: 'Product', width: 140 },
    { name: 'name', label: 'Name', width: 180 },
    { name: 'quantity', label: 'Quantity', width: 120, align: 'right', renderer: { type: 'number' } },
    { name: 'amount', label: 'Amount', width: 140, align: 'right', renderer: { type: 'number' } },
  ];
}
