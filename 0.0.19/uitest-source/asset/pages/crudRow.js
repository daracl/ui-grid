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
    editable: true,
    deleteMode: 'soft',
    aside: {
      lineNumber: { enabled: true },
      rowCheckbox: {
        enabled: true,
        width: 27,
      },
      modifyInfo: { enabled: true },
    },
    fields: colItem,
    items: aaa,
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
