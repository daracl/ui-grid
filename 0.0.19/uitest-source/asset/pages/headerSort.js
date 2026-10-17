var gridObj;

function loadGrid(initFlag) {
  const jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(true);
});

function gridDraw(element, aaa, colItem, message) {
  gridObj = Daracl.grid.create(element, {
    theme: G_GRID_THEME,
    header: {
      sort: {
        enabled: false,
      },
    },
    fields: colItem,
    items: aaa,
  });
}
