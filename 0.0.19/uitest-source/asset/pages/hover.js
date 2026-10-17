var gridObj;

function loadGrid(theme, hoverMode) {
  const jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields, theme, hoverMode);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(G_GRID_THEME, 'cell');
});

let toolbarSelectionMode = 'cell';
function gridDraw(element, items, fields, theme, selectMode) {
  gridObj = Daracl.grid.create(element, {
    hoverMode: selectMode,
    theme: theme,
    fields: fields,
    items: items,
    toolbar: {
      enabled: true,
      height: 40,
      defaultValues: {
        mode: toolbarSelectionMode,
      },
      items: [
        [
          {
            position: 'left',
            children: [
              {
                label: '선택모드',
                name: 'mode',
                gap: [10, 20],

                renderer: {
                  type: 'choice',
                  listItem: {
                    multiple: false,
                    list: [
                      { label: '셀(cell)', value: 'cell' },
                      { label: '로우(row)', value: 'row' },
                      { label: 'None(none)', value: 'none' },
                    ],
                  },
                },

                change: (info) => {
                  toolbarSelectionMode = info.value;
                  loadGrid(theme, info.value);
                },
              },
            ],
          },
        ],
      ],
    },
  });
}
