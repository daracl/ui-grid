function getItem(type, itemCount, cellCount) {
  let items = GRID_EMPLOYEE_DATA;
  let fields = GRID_EMPLOYEE_FIELDS;

  if (fields[0] && !fields[0].renderer) {
    fields[0].renderer = {
      type: 'link',
    };

    fields[0].renderer.click = (item) => {
      console.log('field click : ', item);
    };
  }

  return {
    items: items,
    fields: fields,
  };
}
