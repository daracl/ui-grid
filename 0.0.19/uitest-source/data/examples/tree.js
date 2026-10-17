function getItem(type, itemCount, cellCount) {
  let items = G_TREE_CHILD_DATA;
  let fields = G_TREE_CHILD_FIELDS;

  if (true) {
    fields.push({
      name: 'desc',
      label: '설명',
      width: 120,
    });
  }

  return {
    items: items,
    fields: fields,
  };
}
