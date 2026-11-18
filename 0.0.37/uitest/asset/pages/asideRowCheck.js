var gridObj;

function loadGrid(initFlag) {
  const jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(true);
});

function gridDraw(element, aaa, colItem, message) {
  gridObj = Daracl.grid.create(
    element,
    {
      editable: true,
      style: 'striped',
      selectionMode: 'multiRow', // row , cell , multiRow , multiCell	// 선택 방법.
      theme: G_GRID_THEME,
      aside: {
        lineNumber: { enabled: true },
        rowCheckbox: {
          enabled: true,
          width: 27,
          checkOnRowSelect: true,
        },
        modifyInfo: { enabled: true },
      },
      fields: colItem,
      items: aaa,
    },
    message,
  );
}
