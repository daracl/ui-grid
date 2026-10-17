var gridObj;

function loadGrid(initFlag) {
  const jsonInfo = getItem(1, 500, 20);

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
    enabledTooltip: true,
    header: {
      enabledViewAllLabel: true,
    },
    aside: {
      lineNumber: { enabled: true },
    },

    scroll: {
      vertical: {
        enable1: false,
        onUpdate: function (item) {
          // 스크롤 업데이트.
          //console.log(item);
          //return true;
        },
      },
      horizontal: {
        enabledWheel: true,
      },
    },

    fields: colItem,
    items: aaa,
    body: {
      row: {
        height: 50,
      },
    },
  });
}
