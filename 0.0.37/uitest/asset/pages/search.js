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
    style: 'striped',
    selectionMode: 'multiCell', // row , cell , multiRow , multiCell	// 선택 방법.
    theme: G_GRID_THEME,
    search: {
      enabled: true,
      hideNonMatched: true,
      enabledColumnFix: true,
      click: false,
      mode: 'simple', //'full'
      width: 700,
      height: 250,
      onlyCloseButton: true,
      useRememberValue: true,
      callback: (data) => {
        //console.log(data)
      },
      rememberValue: { field: '$all', val: 'asdf' },
    },
    fields: colItem,
    items: aaa,
  });
}
