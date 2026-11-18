var gridObj;

function fn_init(initFlag) {
  const jsonInfo = getItem(4, 100, 20);

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);
}

document.addEventListener('DOMContentLoaded', function () {
  fn_init(true);
});

function gridDraw(element, aaa, colItem) {
  gridObj = Daracl.grid.create(element, {
    style: 'striped',
    selectionMode: 'multiCell', // row , cell , multiRow , multiCell	// 선택 방법.
    theme: G_GRID_THEME,
    aside: {
      lineNumber: { enabled: true },
    },

    summary: {
      position: 'top',
      height: [50, 40],
      items: [
        [
          { name: 'name', label: '합계\n합계\n합계', whiteSpace: 'pre' },
          { name: 'age', expression: 'sum' },
          {
            name: 'birth',
            rowspan: 2,
            colspan: 2,

            expression: 'count',
          },
          {
            name: 'salary',
            colspan: 2,
            align: 'center',
            cellClassName: function (val) {
              if (val < 5000000) {
                return 'salary-5';
              } else if (val < 10000000) {
                return 'salary-10';
              } else if (val < 15000000) {
                return 'salary-15';
              } else if (val > 15000000) {
                return 'salary-up';
              }
              return '';
            },
            expression: 'sum',
            displayFormat: {
              type: 'number',
              format: '₩ 0,0 원',
            },
          },
        ],
        [
          { name: 'name', label: '평균' },
          {
            name: 'age',
            expression: 'avg',
            displayFormat: {
              type: 'number',
              format: '0,0.00',
            },
          },
          {
            name: 'salary',
            expression: 'avg',
            displayFormat: {
              type: 'number',
              format: '0,0',
            },
          },
        ],
      ],
    },

    fields: colItem,
    items: aaa,
  });
}
