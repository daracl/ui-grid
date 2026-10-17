function getItem() {
  let items = GRID_EMPLOYEE_DATA;
  let fields = [
    {
      name: 'name',
      label: '이름',
      width: 80,
    },
    {
      name: 'age',
      label: '나이',
      width: 50,
    },
    {
      name: 'email',
      label: '이메일',
      width: 120,
    },
    {
      name: 'birth',
      label: '생년월일',
      width: 120,
      editRenderer: {
        type: 'date',
      },
    },
    {
      name: 'position',
      label: '직책',
      width: 80,
    },
    {
      name: 'salary',
      label: '월급',
      width: 80,
      displayFormat: {
        type: 'number',
        format: '₩ 0,0 원',
      },
      headerHelp(fieldInfo) {
        const field = fieldInfo.field;
        return field.label + ' // field 설정';
      },
    },
    {
      name: 'desc',
      label: '설명',
      width: 200,
    },
  ];

  return {
    items: items,
    fields: fields,
  };
}
