var gridObj;

const THEME_KEY = 'grid-theme';
const theme = localStorage.getItem(THEME_KEY);

if (theme) setMainTheme(theme);

function setMainTheme(theme, persist = false) {
  const bodyElement = document.body;

  if (gridObj) gridObj.setTheme(theme);

  bodyElement.setAttribute('data-daracl-theme', theme);

  if (persist) {
    localStorage.setItem(THEME_KEY, theme);
  }
}

function fn_button() {
  const themeElement = document.getElementById('theme');

  themeElement.addEventListener('change', (e) => {
    const value = themeElement.value;

    if (value) {
      setMainTheme(value, true);
    }
  });
}

function loadGrid(initFlag) {
  const themeElement = document.getElementById('theme');

  if (themeElement) themeElement.value = theme ?? 'light';

  if (initFlag) {
    const dgGridSampleConfig = localStorage.getItem('dgGridSampleConfig');

    if (dgGridSampleConfig) {
      try {
        const cfg = JSON.parse(dgGridSampleConfig);

        document.getElementById('dataType').value = cfg.itemType;
        document.getElementById('itemCount').value = cfg.itemCount;
        document.getElementById('cellCount').value = cfg.cellCount;
      } catch (e) {
        console.log('dgGridSampleConfig : ', dgGridSampleConfig, e);
      }
    }
  }

  const itemType = document.getElementById('dataType').value;
  const itemCount = parseInt(document.getElementById('itemCount').value, 10);
  const cellCount = parseInt(document.getElementById('cellCount').value, 10);

  localStorage.setItem('dgGridSampleConfig', JSON.stringify({ itemType, itemCount, cellCount }));

  const jsonInfo = getItem(itemType, itemCount, cellCount);

  gridDraw(document.getElementById('sample'), jsonInfo.items, jsonInfo.fields);

  /*
    gridDraw(document.getElementById('sample2'), item.aaa, item.colItem, {
      'asdf': ''
      , "no.data": '데이타 없음'
      //,empty: function (){ return '데이타 없음'}

    });
    */
}

document.addEventListener('DOMContentLoaded', function () {
  Daracl.grid.message({ 'no.data': '데이터가 없습니다.', 'select.all': 'ALL' });
  fn_button();
  loadGrid(true);
});

function gridDraw(element, aaa, colItem, message) {
  gridObj = Daracl.grid.create(
    element,
    {
      editable: false,
      style: 'striped',
      selectionMode: 'multiCell', // row , cell , multiRow , multiCell	// 선택 방법.
      enabledWidthFixed: false,
      enabledTooltip: true, // tooltip flag
      theme: G_GRID_THEME,
      fixedLeftIndex: 0,
      fixedRightIndex: 0,
      height: 'auto',
      aside: {
        lineNumber: { enabled: true },
        rowCheckbox: {
          enabled: true,
          //, allowMultiSelect: false
        },
        modifyInfo: { enabled: true },
      },

      header: {
        view: true,
        enabledViewAllLabel: true,
        //, heights: [20, 50, 50]
        sort: {
          //정렬 활성화 여부
          enabled: true,
          // null value 를 항상 끝으로 유지 할지 여부
          //nullsLast: true,
          // custom sorting function
          //,customSorting: ()=>{console.log(arguments)}
        },
        //,height :30
        resize: {
          enabled: true,
          update: function (item) {
            //console.log(item);
          },
          minWidth: 10,
          maxWidth: 1000,
        },
        help: {
          enabled: true, // header help btn 활성 여부.
          tootip: (field) => {
            return 'test';
          },
          click: (clickInfo) => {
            // click event
            console.log('clickInfo : ', clickInfo);
          },
        },
        drag: {
          enabled: true,
          dropSelector: '#dropTextArea',
          dropCallback: (data) => {},
        },
      },
      summary: {
        position: 'top',
        height: [30, 40],
        items: [
          [
            { name: 'name', label: '합계' },
            { name: 'age', expression: 'sum' },
            {
              name: 'salary',
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
      search: {
        enabled: true,
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
      toolbar: {
        enabled: false,

        items: [
          {
            search: true,
            callback: (keyword) => {},
          },

          {
            divider: true,
          },
          {
            key: 'test',
            renderType: 'dropdown',
            style: {
              valueWidth: '200px',
            },
            listItem: {
              list: [
                { label: 'asdf', value: 1 },
                { label: 'asdf2', value: 2 },
                { label: 'asdf3', value: 3 },
              ],
            },
            change: (aa) => {
              console.log(aa);
            },
          },
          {
            key: 'test22',
            renderType: 'text',
            style: {
              valueWidth: '150px',
            },
            change: (aa) => {
              console.log(aa);
            },
          },
          {
            label: 'button',
            renderType: 'button',
            click: (aa) => {
              console.log(aa);
            },
          },
        ],
      },
      scroll: {
        width: 12,
        vertical: {
          enabled: true,
          onUpdate: function (item) {
            // 스크롤 업데이트.
            //console.log(item);
            //return true;
          },
        },
        horizontal: {
          enabled: true,
          enabledWheel: true,
        },
      },
      footer: {
        enabled: true,

        height: 35,
        paging: {
          enabled1: true,
          /**
           * 위치 값
           */
          position: 'center',
          formatPosition: 'right',
          /**
           * 페이지 메시지 포멧
           */
          format: '{{start}} - {{end}} of {{total}}',

          // 페이지 콜백
          callback1: function (arg) {
            console.log(arg);
            //gridObj.setItems(aaa);
          },
        },

        selection: {
          position: 'left',
          format:
            'Count : {{count}} {{if(enabledSummary)}} Avg : {{avg}} Min : {{min}} Max : {{max}} Sum : {{sum}}{{/if}}',
        },
      },
      // , paging: {
      //   totalCount: 10000
      //   , page: 500
      //   , pageSize: 10
      //   , unitPage: 10
      // }
      fields: colItem,
      items: aaa,
      body: {
        cellDblClick: function (itemInfo) {
          //console.log('cellDblClick', itemInfo)
        },
        cellClick: function (itemInfo) {
          //console.log('cellClick', itemInfo)
        },
        // 방향키 컨트롤 .
        keyNavHandler: function (moveInfo) {
          console.log('moveInfo : ', moveInfo);
        },
        pasteBefore: function (a) {
          console.log('pasteBefore', a);
          return a;
        },
        pasteAfter: function (a) {
          console.log('pasteAfter', a);
        },
        row: {
          //height: 30,
        },
      },

      contextMenu: {
        enabledHeader: true,
        beforeActivate: function (info) {
          const field = info.field;
          const item = info.item;
          if (item) {
            gridObj.changeContextMenuHeader(item[field.name]);
          }
        },
        callback: function (item) {
          console.log(item.key, item);

          if (item.key == 'copy') {
            gridObj.copyData();
          }
        },
        items: [
          { key: 'refresh', label: '새로고침' },
          {
            divider: true,
          },
          {
            key: 'copy',
            label: '복사',
            hotkey: 'Ctrl+C',
            callback: function (item) {
              console.log('direct copy callback : ', item.key, item);

              if (item.key == 'copy') {
                gridObj.copyData();
              }
            },
          },
          {
            key: 'sql_create',
            label: 'sql생성',
            disabled: true,
            children: [
              { key: 'selectStar', label: 'select *' },
              { key: 'select', label: 'select column' },
              { key: 'insert', label: 'insert' },
              { key: 'update', label: 'update' },
              { key: 'delete', label: 'delete' },
              { key: 'drop', label: 'drop' },
            ],
          },
          {
            key: 'download',
            label: 'download',
            children: [
              { checkbox: true, label: 'selet data', key: 'sqlGridResultSelect' },
              { divider: true },
              { key: 'download_excel', label: 'EXCEL' },
              { key: 'download_csv', label: 'CSV' },
              { key: 'download_xml', label: 'XML' },
              { key: 'download_json', label: 'json' },
            ],
          },
          {
            key: 'create_ddl',
            label: 'DDL 보기',
            hotkey: 'Ctrl+shift+C',
          },
          {
            key: 'mybatis-sql_create',
            label: 'mybatis Sql생성',
            children: [
              { key: 'mybatis_insert', label: 'insert', mode: 'insert', param_yn: 'Y' },
              { key: 'mybatis_update', label: 'update', mode: 'update', param_yn: 'Y' },
              { key: 'mybatis_delete', label: 'delete', mode: 'delete', param_yn: 'Y' },
            ],
          },
          {
            key: 'export',
            label: '내보내기',
            children: [
              { key: 'export_data', label: '데이타 내보내기' },
              { key: 'export_column', label: '컬럼정보 내보내기' },
            ],
          },
        ],
      },
    },
    message,
  );
}

function getRandomFloatFromInput(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return Math.floor(Math.random() * (max - min) + min);
}
