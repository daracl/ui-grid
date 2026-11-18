export const partNames = ['Bracket', 'Fastener', 'Panel', 'Cover', 'Connector'];

export const descriptions = ['Front', 'Rear', 'Left', 'Right', 'Center'];

export const items = Array.from({ length: 100 }, (_, index) => {
  const partIndex = Math.floor(index / 25);
  const nameIndex = Math.floor((index % 25) / 5);
  const descriptionIndex = index % descriptions.length;

  return {
    id: index + 1,
    partNo: `P-${100 + partIndex * 100}`,
    partName: partNames[nameIndex],
    description: `${descriptions[descriptionIndex]} ${partNames[nameIndex].toLowerCase()}`,
    quantity: ((index % 8) + 1) * (partIndex + 1),
  };
});

export function createExampleFields1() {
  return [
    { name: 'partNo', label: 'Part No.', width: 160 },
    { name: 'partName', label: 'Part Name', width: 220 },
    { name: 'description', label: 'Description', width: 300 },
    { name: 'quantity', label: 'Quantity', width: 120, align: 'right' },
  ];
}
