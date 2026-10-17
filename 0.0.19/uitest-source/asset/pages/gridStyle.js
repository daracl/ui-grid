var gridObj;
var gridStyleMode = 'default';

function loadGrid() {
  const jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid();
});

function gridDraw(element, aaa, colItem) {
  gridObj = Daracl.grid.create(element, {
    style: gridStyleMode,
    selectionMode: 'multiCell',
    enabledWidthFixed: false,
    enabledTooltip: true, // tooltip flag
    theme: G_GRID_THEME,
    aside: {
      lineNumber: { enabled: true },
    },

    scroll: {
      vertical: {
        enable: true,
      },
      horizontal: {
        enable: false,
      },
    },
    fields: colItem,
    items: aaa,

    toolbar: {
      enabled: true,
      height: 40,
      defaultValues: {
        mode: gridStyleMode,
        theme: 'light',
      },
      items: [
        [
          {
            position: 'left',
            children: [
              {
                label: 'Theme',
                name: 'theme',
                gap: [10, 20],
                width: 200,
                renderer: {
                  type: 'choice',
                  listItem: {
                    multiple: false,
                    list: [
                      { label: '다크', value: 'dark' },
                      { label: '라이트', value: 'light' },
                    ],
                  },
                },
                change: (info) => {
                  gridObj.setTheme(info.value);
                },
              },
            ],
          },
          {
            position: 'right',
            children: [
              {
                defaultValue: {
                  href: 'hover.html',
                  label: 'hover 바로가기',
                  target: '_blank',
                },

                renderer: {
                  type: 'link',
                },
                change: (info) => {
                  gridObj.setTheme(info.value);
                },
              },
            ],
          },
        ],
        [
          {
            position: 'left',
            children: [
              {
                label: '선택모드',
                name: 'mode',
                width: 650,
                gap: [10, 20],

                renderer: {
                  type: 'choice',
                  listItem: {
                    multiple: false,
                    list: [
                      { label: 'default', value: 'default' },
                      { label: 'striped', value: 'striped' },
                      { label: 'borderless', value: 'borderless' },
                      { label: 'rows', value: 'rows' },
                      { label: 'stripedRows', value: 'stripedRows' },
                      { label: 'cells', value: 'cells' },
                      { label: 'stripedCells', value: 'stripedCells' },
                    ],
                  },
                },

                change: (info) => {
                  gridStyleMode = info.value;
                  gridObj.setStyle(gridStyleMode);
                },
              },
            ],
          },
        ],
      ],
    },
  });
}
