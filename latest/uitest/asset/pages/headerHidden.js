var gridObj;

function loadGrid(initFlag) {
  const jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(true);
});

function gridDraw(element, aaa, colItem) {
  gridObj = Daracl.grid.create(element, {
    theme: G_GRID_THEME,
    height: 335,
    aside: {
      lineNumber: { enabled: true },
    },
    fields: colItem,
    items: aaa,
    header: {
      view: false,
    },
  });
}
