const koreanFoods = [
  { name: '김치찌개', cd: 'kimchi_stew' },
  { name: '비빔밥', cd: 'bibimbap' },
  { name: '불고기', cd: 'bulgogi' },
  { name: '된장찌개', cd: 'doenjang_stew' },
  { name: '잡채', cd: 'japchae' },
];

const americanFoods = [
  { name: '햄버거', cd: 'hamburger' },
  { name: '핫도그', cd: 'hotdog' },
  { name: '바비큐 립', cd: 'bbq_ribs' },
  { name: '클램 차우더', cd: 'clam_chowder' },
  { name: '치킨 윙', cd: 'chicken_wings' },
];

const chineseFoods = [
  { name: '짜장면', cd: 'zhajiangmian' },
  { name: '탕수육', cd: 'tangsuyuk' },
  { name: '마파두부', cd: 'mapo_tofu' },
  { name: '양장피', cd: 'yangjangpi' },
  { name: '깐풍기', cd: 'kanpunggi' },
];

const japaneseFoods = [
  { name: '스시', cd: 'sushi', disabled: true },
  { name: '라멘', cd: 'ramen' },
  { name: '돈카츠', cd: 'tonkatsu' },
  { name: '우동', cd: 'udon' },
  { name: '오코노미야키', cd: 'okonomiyaki' },
];

const allFoods = [...koreanFoods, ...americanFoods, ...chineseFoods, ...japaneseFoods];

function generateItems(itemCount, batchSize = 500) {
  const items = [];
  let i = 0;

  function processBatch() {
    const end = Math.min(i + batchSize, itemCount);
    for (; i < end; i++) {
      items.push({
        a: businessProduct(i),
        b: businessOrder(i),
        c: (i + 1) * 12000,
        d: ['ko', 'en', 'zh', 'jp'][i % 4],
        e: `<div style="width:100px;height:150px;"><a href="#">주문 상세 ${i + 1}</a><br><span>${i}</span></div>`,
        f: ['영업팀', '물류팀', '구매팀'][i % 3],
        g: businessCustomer(i),
        h: i,
        i: 'SKU-' + String(i + 1).padStart(5, '0'),
        j: businessStatus(i),
        k: i % 2 === 0 ? 'Y' : 'N',
        m: businessNote(i),
        s: generateRandomNumbers(1, 100, 6),
        t: generateRandomNumbers(1, 100, 6),
        z: Math.floor(Math.random() * 201) - 100,
        idx: i,
      });
    }

    if (i < itemCount) {
      setTimeout(processBatch, 0); // 다음 배치 처리
    }
  }

  processBatch();
  return items;
}

var itemIdx = 0;

function getItem(type, itemCount, cellCount) {
  itemIdx++;
  let items = [];
  let fields = [];

  const orginItemCount = itemCount;

  itemCount = orginItemCount == 0 ? 1 : itemCount;

  if (type == 1) {
    items = generateItems(itemCount, 1000);
    fields = [
      {
        label: 'a+b',
        children: [
          { name: 'a', label: '에이에이에이에이에이에이', width: 50, sort: true, editable: false },
          {
            name: 'b',
            label: '비',
            width: 100,
            cellClassName: function (rowInfo) {
              const rowIdx = rowInfo.rowIdx;
              if (rowIdx % 3 == 0) {
                return 'dg-primary';
              } else if (rowIdx % 3 == 1) {
                return 'dg-success';
              } else if (rowIdx % 3 == 2) {
                return '';
              }
            },
            editRenderer: {
              type: 'text',
              required: true,
              regexpType: 'email',
              rule: {
                minLength: 0,
                maxLength: 50,
              },
            },
          },
          {
            name: 'z',
            label: 'bar',
            width: 50,
            sort: true,
            headerTooltip: {
              enabled: true,
              content: (header) => {
                const field = header.field;
                console.log(field);
                return `<div>name : ${field.name}</div><div>label : ${field.label}</div>`;
              },
            },
            renderer: {
              type: 'bar',
              rule: {
                minimum: -100,
                maximum: 100,
              },
            },
            editRenderer: {
              type: 'number',
              rule: {
                minimum: -100,
                maximum: 100,
              },
            },
          },
        ],
      },
      {
        name: 's',
        label: 'sparklineBar',
        width: 100,
        headerTooltip: { enabled: false },
        renderer: {
          type: 'sparklineBar',
          //,url : 'http://localhost?aaa={{a}}'
          refValue: (field, value, rowItem) => {
            //console.log(field, value, rowItem);
            return { value: value };
          },
          click: function (item) {
            console.log('link ', item);
          },
        },
      },
      {
        name: 't',
        label: 'sparkline',
        width: 100,
        headerTooltip: {
          enabled: true,
          content: `sparkline : tooltip <br> <span style="color:red;">경고</span>`,
        },
        renderer: {
          type: 'sparkline',
          //,url : 'http://localhost?aaa={{a}}'
          refValue: (field, value, rowItem) => {
            //console.log(field, value, rowItem);
            return { value: value };
          },
          click: function (item) {
            console.log('sparkline ', item);
          },
        },
      },
      {
        name: 'c',
        label: 'link',
        width: 60,
        editable: false,
        renderer: {
          type: 'link',
          //,url : 'http://localhost?aaa={{a}}'
          click: function (item) {
            console.log('link ', item);
          },
        },
      },
      {
        name: 'm',
        label: 'password',
        width: 70,
        renderer: {
          type: 'password',
        },
        editRenderer: {
          type: 'password',
        },
      },
      {
        name: 'h',
        label: 'number',
        width: 60,
        align: 'right',
        renderer: {
          type: 'number',
        },
        editRenderer: {
          type: 'number',
          rule: {
            minimum: -100,
            maximum: 100,
          },
        },
      },
      {
        name: 'k',
        label: 'checkbox',
        width: 100,
        renderer: {
          type: 'checkbox',
          trueValue: 'Y',
          falseValue: 'N',
          showLabel: true,
        },
      },
      {
        name: 'k',
        label: 'switch',
        width: 37,
        renderer: {
          type: 'switch',
          trueValue: 'Y',
          falseValue: 'N',
          // showLabel: true
        },
      },
      {
        name: 'd',
        label: 'dropdown',
        width: 100,
        renderer: {
          type: 'dropdown',
          listItem: {
            labelField: 'name',
            valueField: 'cd',
            list: [
              { name: 'KOREA', cd: 'ko' },
              { name: 'USA', cd: 'en' },
              { name: 'CHINA', cd: 'zh' },
              { name: 'JAPAN', cd: 'jp' },
            ],
          },
        },
      },
      {
        name: 'cc',
        label: 'dropdownz',
        width: 100,
        type: 'text',
        renderer: {
          type: 'dropdown',
          listItem: {
            labelField: 'name',
            valueField: 'cd',
            multiple: true,
            list: (cellInfo, callback) => {
              const item = cellInfo.item;

              if (typeof item === 'undefined') {
                callback(allFoods);
                return;
              }
              const dValue = item.d;

              let foods = [];

              if (dValue == 'en') {
                foods = americanFoods;
              } else if (dValue == 'zh') {
                foods = chineseFoods;
              } else if (dValue == 'jp') {
                foods = japaneseFoods;
              } else {
                foods = koreanFoods;
              }

              callback(foods);
            },
          },
        },
      },
      {
        name: 'e',
        label: 'html',
        width: 100,
        renderer: {
          type: 'html',
        },
      },
      {
        name: 'f',
        label: 'button',
        width: 100,
        renderer: {
          type: 'button',
          label: 'button click',
          click: function (info) {
            console.log('button click', info);
          },
        },
      },
      {
        name: 'g',
        label: 'image',
        width: 100,
        align: 'left',
        visible: false,
        renderer: {
          type: 'image',
          refValue: (field, value, rowItem) => {
            //console.log(field, value, rowItem);
            return { src: '/flags/south_korea.png', label: value };
          },
        },
      },

      //,{key :'d', label:'디', hidden:true}
    ];
  } else if (type == 4) {
    items = GRID_EMPLOYEE_DATA;
    fields = [
      {
        name: 'name',
        label: '이름',
        width: 80,
      },
      {
        name: 'age',
        label: '나이',
        width: 50,
      },
      {
        name: 'email',
        label: '이메일',
        width: 120,
      },
      {
        name: 'birth',
        label: '생년월일',
        width: 120,
        editRenderer: {
          type: 'date',
          /*
          , rule: {
            minimum: -100
            , maximum: 100
          }
            */
        },
      },
      {
        name: 'position',
        label: '직책',
        width: 80,
      },
      {
        name: 'salary',
        label: '월급',
        width: 80,
        displayFormat: {
          type: 'number',
          format: '₩ 0,0 원',
        },
      },
      {
        name: 'desc',
        label: '설명',
        width: 200,
      },
    ];
  } else if (type == 2) {
    for (let i = 0; i < itemCount; i++) {
      let item = {};
      item['sample'] = businessRegion(i);

      for (let j = 1; j <= 12; j++) {
        var aRandomVal = getRandomFloatFromInput(1, 10);
        if (aRandomVal % 4 == 0) {
          item['a' + j] = aRandomVal;
        } else {
          item['a' + j] = aRandomVal % 3 == 0 ? null : String(1200 + (i + j) * 350);
        }

        item['b' + j] = String(1800 + (i + j) * 420);
      }

      items.push(item);
    }

    fields = [
      {
        name: 'sample',
        label: '지역',
        width: 120,
      },
      {
        label: '2022',
        children: [
          {
            label: '1분기',
            children: [
              {
                name: 'a1',
                label: '1월월월월월월',
                dataType: 'numeric',
              },
              {
                name: 'a2',
                label: '2월',
                dataType: 'numeric',
              },
              {
                name: 'a3',
                label: '3월',
                dataType: 'numeric',
              },
            ],
          },
          {
            label: '2분기',
            children: [
              {
                name: 'a4',
                label: '4월',
                dataType: 'numeric',
              },
              {
                name: 'a5',
                label: '5월',
                dataType: 'numeric',
              },
              {
                name: 'a6',
                label: '6월',
              },
            ],
          },
          {
            label: '3분기',
            children: [
              {
                name: 'a7',
                label: '7월',
                dataType: 'numeric',
              },
              {
                name: 'a8',
                label: '8월',
                dataType: 'numeric',
              },
              {
                name: 'a9',
                label: '9월',
                dataType: 'numeric',
              },
            ],
          },
          {
            label: '4분기',
            children: [
              {
                name: 'a10',
                label: '10월',
                dataType: 'numeric',
              },
              {
                name: 'a11',
                label: '11월',
                dataType: 'numeric',
              },
              {
                name: 'a12',
                label: '12월',
                dataType: 'numeric',
              },
            ],
          },
        ],
      },
      {
        label: '2025',
        children: [
          {
            label: '1분기',
            children: [
              {
                name: 'b1',
                label: '1월',
                dataType: 'numeric',
              },
              {
                name: 'b2',
                label: '2월',
                dataType: 'numeric',
              },
              {
                name: 'b3',
                label: '3월',
                dataType: 'numeric',
              },
            ],
          },
          {
            label: '2분기',
            children: [
              {
                name: 'b4',
                label: '4월',
                dataType: 'numeric',
              },
              {
                name: 'b5',
                label: '5월',
                dataType: 'numeric',
              },
              {
                name: 'b6',
                label: '6월',
                dataType: 'numeric',
              },
            ],
          },
          {
            label: '3분기',
            children: [
              {
                name: 'b7',
                label: '7월',
                dataType: 'numeric',
              },
              {
                name: 'b8',
                label: '8월',
                dataType: 'numeric',
              },
              {
                name: 'b9',
                label: '9월',
                dataType: 'numeric',
              },
            ],
          },
          {
            label: '4분기',
            children: [
              {
                name: 'b10',
                label: '10월',
                dataType: 'numeric',
              },
              {
                name: 'b11',
                label: '11월',
                dataType: 'numeric',
              },
              {
                name: 'b12',
                label: '12월',
                dataType: 'numeric',
              },
            ],
          },
        ],
      },
    ];
  } else {
    for (let i = 0; i < itemCount; i++) {
      let tmpItem = {};

      for (let j = 0; j < cellCount; j++) {
        let colName = itemIdx + '_' + j;
        if (j == 0) {
          tmpItem[colName] = i + j;
        } else {
          tmpItem[colName] = businessProduct(i + j);
        }

        //tmpItem[colName] = j< 30 ? ('cont'+i+" _ "+j) :'';
      }

      items.push(tmpItem);
    }
    let colFirstItem;
    if (items.length > 0) {
      colFirstItem = items[0];

      let keyIdx = 0;
      for (let key in colFirstItem) {
        let addColItem = {
          name: key,
          //, label: '한글' + key
          label: key,
          width: 50,
          type: keyIdx == 0 ? 'number' : 'string',
          editor: true,
        };

        if (keyIdx == 1) {
          addColItem.editor = {
            type: 'text',
          };
          addColItem.width = 100;
          addColItem.tooltip = {
            formatter: function (obj) {
              return '정기 납품';
            },
          };
        } else if (keyIdx == 2) {
          addColItem.editor = {
            type: 'select',
            items: [
              { CODE: '111', LABEL: '파폭' },
              { CODE: '2222', LABEL: '크롬' },
            ],
          };
        } else if (keyIdx == 3) {
          addColItem.editor = {
            type: 'textarea',
          };
        } else if (keyIdx == 4) {
          addColItem.editor = {
            type: 'number',
          };
        }
        fields.push(addColItem);

        keyIdx++;
      }
    }
  }

  items = orginItemCount == 0 ? [] : items;

  //console.log(JSON.stringify(aaa));

  return {
    items: items,
    fields: fields,
  };
}

function generateRandomNumbers(start, end, count) {
  if (start > end) {
    throw new Error('시작 값은 끝 값보다 작거나 같아야 합니다.');
  }
  if (count <= 0) {
    throw new Error('생성할 숫자의 개수는 1 이상이어야 합니다.');
  }

  const result = [];
  for (let i = 0; i < count; i++) {
    const random = Math.floor(Math.random() * (end - start + 1)) + start;
    result.push(random);
  }
  return result;
}
