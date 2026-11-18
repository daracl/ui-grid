var gridObj;
// 스크롤 설정 정보

function loadGrid(initFlag) {
  const jsonInfo = getItem();

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  loadGrid(true);
});

function gridDraw(element, aaa, colItem, message) {
  gridObj = Daracl.grid.create(element, {
    fields: colItem,
    items: aaa,
    scroll: {
      vertical: {
        enabled: scrollOpts.vertical,
      },
      horizontal: {
        enabled: scrollOpts.horizontal,
      },
    },
    toolbar: {
      enabled: true,
      height: 40,
      defaultValues: {
        scroll: Object.entries(scrollOpts)
          .filter(([, value]) => value === false)
          .map(([key]) => key)
          .join(','),
      },
      items: [
        [
          {
            position: 'left',
            children: [
              {
                label: '스크롤 비활성',
                name: 'scroll',
                gap: [10, 20],
                width: 200,
                renderer: {
                  type: 'choice',
                  listItem: {
                    list: [
                      { label: '세로', value: 'vertical' },
                      { label: '가로', value: 'horizontal' },
                    ],
                  },
                },
                change: (info) => {
                  console.log(info.value);

                  // scroll 설정
                  const values = info.value;
                  scrollOpts.vertical = !values.includes('vertical');
                  scrollOpts.horizontal = !values.includes('horizontal');

                  loadGrid();
                },
              },
            ],
          },
        ],
      ],
    },
  });
}
