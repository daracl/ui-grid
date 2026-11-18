var itemIdx = 0;

function getItem(type, itemCount, cellCount) {
  itemIdx++;
  let items = GRID_EMPLOYEE_DATA;
  let fields = GRID_EMPLOYEE_FIELDS;

  return {
    items: items,
    fields: fields,
  };
}
