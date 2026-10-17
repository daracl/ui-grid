var scrollOpts = {
  vertical: true,
  horizontal: false,
};

function getItem() {
  let items = GRID_EMPLOYEE_DATA;
  let fields = GRID_EMPLOYEE_FIELDS;

  return {
    items: items,
    fields: fields,
  };
}
