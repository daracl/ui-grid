# DaraGrid (@daracl/grid)

**한국어** | [English](./README.en.md)

프레임워크 의존성 없는 데이터 그리드 라이브러리입니다.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/daracl/ui-grid/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/@daracl%2Fgrid.svg)](https://badge.fury.io/js/@daracl%2Fgrid)
[![npm](https://img.shields.io/npm/d18m/%40daracl%2Fgrid)](https://github.com/daracl/ui-grid/releases)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@daracl%2Fgrid)](https://bundlephobia.com/package/@daracl%2Fgrid)

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

<p>
<img src="https://github.com/daracl/daracl.grid/blob/main/demo.gif?raw=true"/>
</p>

## 주요 기능

- 목록형(List) / 트리형(Tree) 데이터 지원
- 셀/행 단위 편집(inline editing) 및 값 유효성 검증
- 정렬, 컬럼 리사이즈, 다단 헤더(colspan/rowspan), 좌우 컬럼 고정
- 행/셀 선택(단일·다중), row drag & drop 이동
- 검색(simple/full 모드), 페이징, 요약(Summary) 행
- 툴바, 컨텍스트 메뉴, 헤더 도움말/툴팁
- Undo/Redo 히스토리, 값 복사/붙여넣기
- 라이트/다크 테마와 `default`, `striped`, `borderless`, `list` 등 스타일 프리셋
- 다양한 셀 렌더러(text, number, dropdown, checkbox, switch, date, image, link, sparkline 등)

## 설치

```sh
yarn add @daracl/grid
# 또는
npm install @daracl/grid
```

## 빠른 시작

```ts
import { DaraGrid } from '@daracl/grid';
import '@daracl/grid/style/daracl.grid.css';

const grid = DaraGrid.create(document.getElementById('grid'), {
  height: 400,
  editable: true,
  selectionMode: 'multiCell', // row, cell, multiRow, multiCell, none
  theme: 'light', // light, dark
  style: 'striped', // default, striped, borderless, list

  aside: {
    lineNumber: { enabled: true },
    rowCheckbox: { enabled: true },
  },

  header: {
    sort: { enabled: true },
    resize: { enabled: true },
  },

  fields: [
    { name: 'name', label: '이름', width: 100 },
    { name: 'age', label: '나이', width: 60, align: 'right', renderer: { type: 'number' } },
    {
      name: 'position',
      label: '직책',
      width: 120,
      editRenderer: {
        type: 'dropdown',
        listItem: {
          labelField: 'label',
          valueField: 'value',
          list: [
            { label: '개발자', value: 'dev' },
            { label: '디자이너', value: 'design' },
          ],
        },
      },
    },
  ],

  items: [
    { name: '김민수', age: 34, position: 'dev' },
    { name: '이서연', age: 29, position: 'design' },
  ],
});
```

UMD 형태로 스크립트 태그에서 바로 사용할 수도 있습니다.

```html
<link rel="stylesheet" href="./node_modules/@daracl/grid/style/daracl.grid.min.css" />
<script src="./node_modules/@daracl/grid/dist/daracl.grid.min.umd.js"></script>
<script>
  const grid = Daracl.grid.create(document.getElementById('grid'), {
    fields: [{ name: 'name', label: '이름' }],
    items: [{ name: '김민수' }],
  });
</script>
```

## Grid 옵션

| key | 설명 | 기본값 |
|-----|------|-----|
| rowIdField | row 고유 식별 필드명 | `''` |
| theme | 그리드 테마 (`light`, `dark`) | `light` |
| height, width | 그리드 높이/너비 (`auto` 또는 px 숫자) | `auto` |
| style | 바디 스타일 프리셋 (`default`, `striped`, `borderless`, `list`) | `default` |
| selectionMode | 선택 모드 (`row`, `cell`, `multiRow`, `multiCell`, `none`) | `row` |
| hoverMode | 호버 모드 (`row`, `cell`, `none`) | selectionMode에 따라 자동 결정 |
| deleteMode | 삭제 모드 (`hard`, `soft`) | `hard` |
| editable | 셀 편집 기능 활성화 여부 | `false` |
| enableWidthFixed | 컬럼 너비 고정 여부 | `false` |
| enableTooltip | 셀 툴팁 사용 여부 | `false` |
| fixedLeftIndex / fixedRightIndex | 좌/우 고정 컬럼 인덱스 (`-1`이면 미사용) | `-1` |
| fields | 컬럼 정의 목록 ([Field 옵션](#field컬럼-옵션) 참고) | `[]` |
| items | 그리드 행 데이터 목록 | `[]` |
| header | 헤더 옵션 (`view`, `height`, `sort`, `resize`, `help`, `drag` 등) | - |
| aside | 좌측 보조 컬럼 옵션 (`lineNumber`, `rowCheckbox`, `modifyInfo`) | - |
| body | 바디 옵션 (`row.height`, `cellClick`, `cellDblClick`, `rowMove`, `keyNavHandler`, `pasteBefore/After` 등) | - |
| scroll | 스크롤 옵션 (`vertical`, `horizontal`) | - |
| search | 검색 옵션 (`enabled`, `mode: simple|full`, `useRememberValue` 등) | 비활성 |
| toolbar | 툴바 옵션 (`enabled`, `items`) | 비활성 |
| summary | 요약 행 옵션 (`position`, `items`) | - |
| footer | 하단 페이징/선택정보 표시 옵션 | 비활성 |
| paging | 페이징 정보 (`totalCount`, `currPage`, `countPerPage`, `unitPage`) | - |
| contextMenu | 우클릭 컨텍스트 메뉴 옵션 | - |
| tree | 트리 모드 옵션 (`idField`, `parentIdField`, `childrenField`, `isFlatData` 등). 설정하지 않으면 목록형으로 동작 | `undefined` |
| dataTypeFormatter | `money`, `number` 타입 기본 포맷(prefix/suffix/fixed) | - |
| i18n | 다국어 메시지 리소스 | - |

전체 타입 정의는 [`src/types/GridOptions.d.ts`](./src/types/GridOptions.d.ts)를 참고하세요.

## Field(컬럼) 옵션

| key | 설명 | 기본값 |
|-----|------|-----|
| name | 데이터 필드명 | - |
| label | 헤더에 표시할 라벨 | - |
| width | 컬럼 너비(px) | - |
| align | 값 정렬 (`left`, `center`, `right`) | `center` |
| hidden | 컬럼 숨김 여부 | `false` |
| sort | 정렬 가능 여부 | `false` |
| editable | 편집 가능 여부(그리드 `editable: true`일 때 적용) | `true` |
| renderer | 뷰 렌더러 타입/옵션 (`type`, 렌더러별 추가 옵션) | `{ type: 'text' }` |
| editRenderer | 편집 렌더러 타입/옵션 | `{ type: 'text' }` |
| defaultValue | 행 추가 시 기본값 | `''` |
| displayFormat | 값 표시 포맷 (`{ type: 'number', format: '0,0' }` 등) | - |
| cellClassName | 셀 클래스명 또는 `(rowInfo) => string` 콜백 | - |
| tooltip | 셀 툴팁 (`enabled`, `content`) | 비활성 |
| headerHelp | 헤더 도움말 텍스트/콜백 | - |
| children | 다단 헤더 구성을 위한 하위 컬럼 목록 | - |

전체 타입 정의는 [`src/types/GridField.d.ts`](./src/types/GridField.d.ts)를 참고하세요.

## 렌더러 타입

| 구분 | 사용 가능한 `type` |
|-----|-----|
| view (`renderer.type`) | `text`, `number`, `password`, `dropdown`, `checkbox`, `bar`, `button`, `html`, `image`, `link`, `sparkline`, `sparklineBar`, `tree`, `custom` |
| edit (`editRenderer.type`) | `text`, `number`, `password`, `textarea`, `dropdown`, `checkbox`, `switch`, `range`, `date`, `custom` |
| aside | `lineNumber`, `rowCheckbox`, `modifyInfo`, `rowDragHandle` |

렌더러 등록 위치는 [`src/constantRenders.ts`](./src/constantRenders.ts)이며, `src/renderer/view`, `src/renderer/edit`, `src/renderer/toolbar` 하위에 타입별 구현체가 있습니다.

## 주요 API (`DaraGrid` 인스턴스)

| 메소드 | 설명 |
|-----|-----|
| `DaraGrid.create(element, options, message?)` | 그리드 인스턴스 생성 |
| `DaraGrid.instance(elementOrId)` | 이미 생성된 그리드 인스턴스 조회 |
| `getItems()` / `setItems(items)` / `clearItems()` | 전체 행 데이터 조회/설정/초기화 |
| `addItems(items, opts?)` / `createItem(item, opts?)` / `removeItems(ids)` | 행 추가/삭제 |
| `getChangedItems()` | 추가·수정·삭제된 행만 조회 |
| `getSelection()` / `getSelectedRows()` / `getSelectedRowIds()` | 선택 정보 조회 |
| `getCheckedItems(names?)` / `setAllCheckedItems(checked)` | 체크박스 상태 조회/설정 |
| `search(keyword, opts)` | 데이터 검색 |
| `setTheme(themeName)` / `setStyle(styleName)` | 테마/스타일 변경 |
| `expandAll()` / `collapseAll()` | 트리 모드 전체 펼치기/접기 |
| `copyData()` | 선택 영역 클립보드 복사 |
| `destroy()` | 그리드 인스턴스 제거 |

전체 API는 [`src/DaraGrid.ts`](./src/DaraGrid.ts)와 [typedoc 문서](https://ui.daracl.com)를 참고하세요.

## 개발

```sh
yarn install
yarn dev        # vite 개발 서버 실행, /uitest/index.html 자동 오픈
yarn test       # Jest 유닛 테스트
yarn build      # 배포용 빌드 (ESM/CJS + UMD)
yarn docs:gen   # typedoc API 문서 생성
```

기능별 수동/시각 테스트 페이지는 `uitest/*.html`에서 확인할 수 있습니다(편집, 트리, 정렬, 검색, 페이징, 컨텍스트 메뉴, 행 이동 등).

## License

Daracl is under [MIT License](./LICENSE).
