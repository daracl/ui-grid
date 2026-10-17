var gridObj;
function loadGrid(initFlag) {
  let jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(true);
});

function gridDraw(element, aaa, colItem) {
  gridObj = Daracl.grid.create(element, {
    selectionMode: 'cell', // row , cell , multiRow , multiCell	// 선택 방법.
    tree: {
      expandDepth: 0,
      defaultExpandedIds: ['1-1'],
      treeNodeIconClass(item, value) {
        if ((item.id || '').startsWith('1-1')) {
          return item._dg$depth === 2 ? 'dg-file-type1' : 'dg-folder-type1';
        } else if ((item.id || '').startsWith('1-2')) {
          return item._dg$depth === 2 ? 'dg-file-type2' : 'dg-folder-type2';
        } else {
          return '';
        }
      },
    },
    search: {
      enabled: true,
      //hideNonMatched: true,
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
    toolbar: {
      enabled: true,
      height: 40,
      items: [
        [
          {
            position: 'left',
            children: [
              {
                label: '전체열기',
                renderer: {
                  type: 'button',
                },
                click: (info) => {
                  gridObj.expandAll();
                },
              },
              {
                label: '전체닫기',
                renderer: {
                  type: 'button',
                },
                click: (info) => {
                  gridObj.collapseAll();
                },
              },
            ],
          },
        ],
      ],
    },
  });
}
