var gridObj;

GRID_EMPLOYEE_DATA.forEach((emp) => {
  if (!emp.food) {
    const foods = foodMap[emp.country];

    if (foods) {
      emp.food = getRandomFoods(foods);
    } else {
      emp.food = [];
    }
  }
});

function loadGrid(initFlag) {
  const jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(true);
});

function gridDraw(element, aaa, colItem, message) {
  gridObj = Daracl.grid.create(element, {
    editable: true,
    style: 'striped',
    deleteMode: 'soft',
    selectionMode: 'multiCell', // row , cell , multiRow , multiCell	// 선택 방법.
    enabledTooltip: true, // tooltip flag
    theme: G_GRID_THEME,
    height: 480,
    aside: {
      lineNumber: { enabled: true },
      rowCheckbox: {
        enabled: true,
        width: 27,
      },
      modifyInfo: { enabled: true },
    },
    scroll: {
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
    toolbar: {
      enabled: true,
      height: 40,
      items: [
        [
          {
            position: 'left',
            children: [
              {
                renderer: { type: 'button', icon: 'add' },
                label: '행 추가',
                click(info) {
                  gridObj.createItem({});
                },
              },
              {
                renderer: { type: 'button', icon: 'delete' },
                label: '선택 행 삭제',
                click(info) {
                  gridObj.removeItems(gridObj.getSelectedRowIds());
                },
              },
              {
                renderer: { type: 'button', icon: 'delete' },
                label: '체크된 행 삭제',
                click(info) {
                  gridObj.removeItems(gridObj.getCheckedIds());
                },
              },
            ],
          },
        ],
      ],
    },
  });
}
