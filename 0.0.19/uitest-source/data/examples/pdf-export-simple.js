export const items = [
  { id: 1, name: 'Mina Kim', department: 'Engineering', salary: 5200000 },
  { id: 2, name: 'Joon Park', department: 'Design', salary: 4600000 },
  { id: 3, name: 'Sora Lee', department: 'Product', salary: 4900000 },
  { id: 4, name: 'Daniel Choi', department: 'Engineering', salary: 5800000 },
  { id: 5, name: 'Yuna Han', department: 'QA', salary: 4300000 },
  { id: 6, name: 'Alex Jung', department: 'Product', salary: 5100000 },
];

export function createExampleFields1() {
  return [
    { name: 'id', label: 'ID', width: 80, align: 'right' },
    { name: 'name', label: 'Name', width: 180 },
    { name: 'department', label: 'Department', width: 180 },
    {
      name: 'salary',
      label: 'Salary',
      width: 160,
      align: 'right',
      displayFormat: { type: 'number', format: '₩ 0,0' },
    },
  ];
}
