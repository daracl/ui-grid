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
    style: 'striped',
    selectionMode: 'multiCell', // row , cell , multiRow , multiCell	// 선택 방법.
    enabledTooltip: true, // tooltip flag
    theme: G_GRID_THEME,
    aside: {
      lineNumber: { enabled: true },
    },

    fields: colItem,
    items: aaa,
    header: {
      view: true,
      help: {
        enabled: true, // header help btn 활성 여부.
        content(fieldInfo) {
          const field = fieldInfo.field;
          return field.label;
        },
        click: (clickInfo) => {
          // click event
          console.log('clickInfo : ', clickInfo);
        },
      },
    },
  });
}
