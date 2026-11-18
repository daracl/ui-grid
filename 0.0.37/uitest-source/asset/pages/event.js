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
      style: 'striped',
      selectionMode: 'multiRow', // row , cell , multiRow , multiCell	// 선택 방법.
      fields: colItem,
      items: aaa,
      body: {
        cellClick1: (item) => {
          console.log('cellClick : ', item);
        },
      },
    },
    message,
  );
}
