# DaraGrid (@daracl/grid)

**한국어** | [English](./README.en.md)

프레임워크 의존성 없는 데이터 그리드 라이브러리입니다.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/daracl/ui-grid/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/@daracl%2Fgrid.svg)](https://badge.fury.io/js/@daracl%2Fgrid)
[![npm](https://img.shields.io/npm/d18m/%40daracl%2Fgrid)](https://github.com/daracl/ui-grid/releases)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@daracl%2Fgrid)](https://bundlephobia.com/package/@daracl%2Fgrid)
[![Documentation](https://img.shields.io/badge/docs-daracl.github.io-4c9aff)](https://daracl.github.io/ui-grid/)

## 문서

📖 **<https://daracl.github.io/ui-grid/>**

옵션, 렌더러, API 설명과 동작하는 예제를 문서 사이트에서 확인할 수 있습니다.
위 주소는 항상 최신 버전 문서로 연결되며, 특정 버전이 필요하면 `https://daracl.github.io/ui-grid/<version>/` 형식으로 접근할 수 있습니다(예: [0.0.12](https://daracl.github.io/ui-grid/0.0.12/)).

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
| theme | 그리드 테마 (`light`, `dark`). 지정하지 않으면 상위 요소의 `data-daracl-theme` 속성을 따르고, 속성이 없으면 `light` | 미지정 |
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
| paging | 페이징 정보 (`totalCount`, `page`, `pageSize`, `unitPage`) | - |
| contextMenu | 우클릭 컨텍스트 메뉴 옵션 | - |
| tree | 트리 모드 옵션 (`idField`, `parentIdField`, `childrenField`, `isFlatData` 등). 설정하지 않으면 목록형으로 동작 | `undefined` |
| groupingFields | 상세 행을 계층 그룹으로 정렬하고 같은 그룹 값은 첫 행에만 표시할 필드 목록(바깥 그룹부터 지정) | `[]` |
| rowSpanFields | 연속된 같은 값을 세로 병합할 필드 목록(바깥 그룹부터 지정). `groupingFields`와 별도로 사용할 수 있습니다. | `[]` |
| groupSummaryFields | 그룹 집계 설정 목록: { field, expression } | `[]` |
| showGroupSummary / showGrandSummary | 최하위 그룹 소계 / 전체 합계 행 표시 여부 | `true` |
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
| `getItems()` | 현재 페이지·검색 결과·트리 펼침 상태에 따른 표시 대상의 실제 행 조회 |
| `getAllItems()` | 검색·페이징·트리 접힘과 무관하게 로드된 전체 원본 행 조회 |
| `setItems(items)` / `clearItems()` | 행 데이터 설정/초기화 |
| `addItems(items, opts?)` / `createItem(item, opts?)` / `removeItems(ids)` | 행 추가/삭제 |
| `getChangedItems()` | 추가·수정·삭제된 행만 조회 |
| `getSelection()` / `getSelectedRows()` / `getSelectedRowIds()` | 선택 정보 조회 |
| `getCheckedItems(names?)` / `setAllCheckedItems(checked)` | 체크박스 상태 조회/설정 |
| `search(keyword, opts)` | 데이터 검색 |
| `exportPdf(options?)` | 현재 뷰의 전체 행과 그룹 합계 행을 PDF로 다운로드 |
| `exportExcel(options?)` | 현재 뷰의 표시 값·그룹 합계·rowSpan을 XLSX로 다운로드 |
| `exportCsv(options?)` | 실제 데이터 행을 CSV로 다운로드 |
| `exportJson(options?)` | 필드명을 키로 하는 JSON 행 배열 다운로드 |
| `setTheme(themeName)` / `setStyle(styleName)` | 테마/스타일 변경 |
| `expandAll()` / `collapseAll()` | 트리 모드 전체 펼치기/접기 |
| `copyData()` | 선택 영역 클립보드 복사 |
| `destroy()` | 그리드 인스턴스 제거 |

전체 API는 [`src/DaraGrid.ts`](./src/DaraGrid.ts)와 [typedoc 문서](https://ui.daracl.com)를 참고하세요.

`getItems()`의 기존 반환 범위는 유지합니다. `getAllItems()`는 접힌 트리의 자손까지 평탄한 배열로 반환하며 soft 삭제 행도 포함합니다. 두 메소드 모두 그룹 소계·총계와 내부 관리 필드를 제외한 행의 얕은 복사본을 반환합니다. 외부 페이징 콜백을 사용하는 경우 서버의 미로드 데이터는 포함하지 않습니다.

`deleteMode: 'soft'`는 행을 유지하고 삭제 상태만 표시하며, 트리에서는 선택한 부모의 자손도 함께 처리합니다. 잘못된 ID가 있으면 전체 soft 삭제 요청을 변경 전에 거부합니다. hard 삭제는 실제 행을 제거하고, 한 번의 `removeItems()` 호출을 하나의 Undo/Redo 단위로 기록합니다.

페이징 콜백이 없으면 로드된 목록을 검색 → 정렬 → 페이징 순서로 처리하고 전체 개수도 현재 검색 결과에 맞춥니다. `footer.paging.callback`이 있으면 외부 페이징으로 처리하여 제공된 `totalCount`와 로드한 현재 페이지를 유지합니다.

### 사용자 정렬

`header.sort.customSorting`은 실제 행 데이터의 얕은 복사본 배열, 정렬 정보, 정렬 옵션을 받습니다. 모든 입력 행을 ID 변경·누락·중복 없이 한 번씩 반환해야 합니다. 받은 배열을 그대로 정렬해서 반환할 수 있으며 기존 `ViewItem[]` 반환도 지원합니다. 잘못된 반환값은 오류로 알립니다.

```ts
header: {
  sort: {
    customSorting: (items, sortOrders) => {
      const direction = sortOrders[0]?.ascOrder === false ? -1 : 1;
      return items.sort((a, b) => direction * (a.amount - b.amount));
    },
  },
}
```

목록·그룹에서는 현재 검색 결과 전체를 페이징 전에 정렬하고 그룹 가상 행은 콜백에 전달하지 않습니다. 트리는 부모·자식 관계를 유지하도록 각 형제 행 배열에 콜백을 적용합니다. 콜백 타입은 `CustomSortingCallback`으로 export합니다.

### 파일 내보내기

`exportPdf()`는 `fileName`, `title`, `author`, `pageSize`, `orientation`, `margin`, `fontName`, `fontSize` 옵션을 지원합니다. 그룹 그리드는 반복되는 그룹 값을 화면처럼 숨기고 셀 배경색과 테두리를 반영합니다. 막대 및 스파크라인 계열 renderer는 PDF에서도 벡터 차트로 출력됩니다. 기본으로 포함된 Noto Sans KR 글꼴을 사용해 한글을 표시하며, 필요하면 사용자 정의 TTF/OTF 글꼴 데이터를 지정할 수 있습니다.

다단 헤더는 PDF 첫 페이지에 전체 계층과 셀 병합을 표시하고, 두 번째 페이지부터는 최하위 컬럼 제목만 반복합니다.

PDF 변환 코드와 PDFKit은 `exportPdf()` 호출 시 처음 로드됩니다. ESM/CJS 배포 파일은 생성된 청크 파일도 함께 배포해야 합니다. UMD 빌드는 `daracl.grid.min.umd.js` 옆에 `daracl.grid.pdf.min.mjs`를 배포하며, 비압축 버전은 `daracl.grid.umd.js`와 `daracl.grid.pdf.mjs`를 사용합니다. PDF 모듈을 미리 `<script>`로 추가할 필요는 없습니다. 기본 한글 글꼴을 사용하려면 `assets/NotoSansKR-Regular.ttf`와 `assets/OFL.txt`도 동일한 디렉터리 구조로 배포해야 합니다.

```ts
await grid.exportPdf({
  fileName: 'orders.pdf',
  title: '주문 목록',
  orientation: 'landscape',
  fontSize: 9,
});
```

`exportExcel()`은 외부 라이브러리 없이 XLSX의 XML과 ZIP을 직접 생성합니다. 현재 뷰의 열 순서·숨김·표시 라벨·그룹 소계 및 총계·rowSpan 병합·배경색·글자색·테두리·정렬을 반영합니다. 숫자와 boolean은 원래 형식으로 저장하고, 표시 형식이 적용된 값은 화면의 문자열로 저장합니다. 트리 열은 단계별 셀 들여쓰기와 행 그룹을 적용합니다. 트리는 기본적으로 접힌 하위 행까지 모두 내보내며, `includeCollapsed: false`를 지정하면 현재 표시되는 행만 내보냅니다. 화면의 접기 상태는 변경하지 않습니다. 막대·스파크라인·스파크라인 막대는 배열 텍스트 대신 셀에 맞춘 DrawingML 벡터 도형으로 출력합니다. 도형은 엑셀의 데이터 편집형 차트가 아니며 내보내기 시점의 모양을 유지합니다. 이미지·사용자 HTML은 표시 값으로, 다단 헤더는 전체 계층과 가로·세로 병합을 내보내며, 헤더 고정·필터·차트 위치도 전체 헤더 높이에 맞춥니다.

```ts
await grid.exportExcel({
  fileName: 'products.xlsx',
  sheetName: '상품',
  freezeHeader: true,
  autoFilter: false,
  includeRowNumber: true,
  mergeCells: true,
});
```

`fileName`의 기본값은 `grid-export.xlsx`, `sheetName`은 `Grid`입니다. `freezeHeader`, `includeRowNumber`, `mergeCells`는 기본적으로 활성화되고 `autoFilter`는 비활성화됩니다. 행 번호는 그리드에서 표시 중일 때만 포함됩니다. XLSX는 현재 페이지의 검색·정렬 결과를 포함하며 화면 밖의 가상 행도 내보냅니다. Excel의 행·열·셀 텍스트 제한을 초과하면 오류를 반환합니다.

엑셀 코드는 `exportExcel()` 호출 시 로드됩니다. ESM/CJS 배포 시 생성된 청크 파일을 함께 배포해야 합니다. UMD 배포 시 메인 스크립트 옆에 `daracl.grid.excel.min.mjs`를, 비압축 버전은 `daracl.grid.excel.mjs`를 배포합니다. 파일을 미리 `<script>`로 추가할 필요는 없습니다. 수동 예제는 `uitest/excel-export.html`입니다.

## 서버 연동 (AJAX DataSource)

`dataSource` 옵션을 지정하면 서버에서 조회·검색·저장·삭제할 수 있습니다. 옵션이 없으면 기존 로컬 동작과 완전히 동일합니다. 데이터 상태(C/U/D/R), Undo/Redo, List·Tree·Group 처리는 기존 `DataManager`를 그대로 사용하고, 서버 통신은 `RemoteDataController`와 `DataSource`가 담당합니다. HTTP 전송은 `@daracl/core`의 `Ajax`를 사용합니다.

### 기본 조회·검색·저장·삭제

```ts
const grid = DaraGrid.create(element, {
  editable: true,
  rowIdField: 'id',
  fields: [...],
  dataSource: {
    load: { url: '/api/users/search', method: 'POST' }, // 기본 GET. GET은 쿼리 스트링, 그 외는 JSON 본문
    save: { url: '/api/users/save', method: 'POST' },
    remove: { url: '/api/users/delete', method: 'POST' },
  },
});

await grid.load();                                    // 조회
await grid.searchRemote({ name: '홍길동' });          // 조건 검색 (서버 페이징이면 1페이지부터)
await grid.reload();                                  // 마지막 조건으로 재조회
await grid.save();                                    // 변경된 행만 저장
await grid.removeRemote();                            // 선택 행 서버 삭제 (또는 { rowIds })
```

| 메소드 | 반환 | 설명 |
|-----|-----|-----|
| `load(params?, { discardChanges? })` | `Promise<LoadResult \| null>` | 조회. `params`를 생략하면 마지막 조건 사용 |
| `searchRemote(params, options?)` | `Promise<LoadResult \| null>` | 조건 검색. 클라이언트 `search()`와 별개 |
| `reload(options?)` | `Promise<LoadResult \| null>` | 마지막 조건·현재 페이지로 재조회 |
| `save()` | `Promise<SaveSummary \| null>` | `{ created, updated, deleted, failed }` |
| `removeRemote({ rowIds? })` | `Promise<RemoveSummary \| null>` | `{ removed, discarded }` |

`load(params)`와 `searchRemote`는 툴바가 활성화되어 있으면 툴바 필드 값(`getToolbarValues()`)을 조회 조건에 자동으로 합칩니다(같은 이름은 인자가 우선, 끄려면 `dataSource.toolbarParams: false`). `load()`를 인자 없이 호출하면 첫 조회는 툴바 값만, 이후에는 마지막 조건을 재사용합니다. 검색 필드에서 호출하면 검색어와 다른 조건 필드를 함께 서버로 보냅니다. `reload()`는 그때 합쳐진 조건을 그대로 재사용합니다.

### 툴바 검색 자동 연결 (toolbar.remote)

`toolbar.remote`를 켜면 검색 필드의 Enter·검색 버튼에서 툴바 값으로 `searchRemote`가 자동 실행됩니다.

```ts
{
  toolbar: {
    enabled: true,
    remote: true, // 또는 { trigger: ['search', 'change'], debounce: 300, discardChanges: false }
    items: [[{ position: 'left', children: [
      { name: 'status', renderer: { type: 'dropdown', listItem: { list: [...] } } },
      { name: 'keyword', renderer: 'search', placeholder: '검색어' },
    ] }]],
  },
  dataSource: { load: { url: '/api/users' } },
}
```

| 옵션 | 기본 | 설명 |
|-----|-----|-----|
| `trigger` | `['search']` | `'search'`: 검색 필드 Enter·버튼, `'change'`: 조건 필드 값 변경(검색어 입력 제외) |
| `debounce` | `change` 300, 그 외 0 | 연속 변경 지연(ms) |
| `discardChanges` | `false` | 미저장 변경을 버리고 조회. `false`이면 `UNSAVED_CHANGES`로 거부되고 `loadError` 이벤트로 알림 |

필드에 `search` 콜백이 있으면 먼저 실행하며 `false`를 반환하면 자동 조회하지 않습니다. `dataSource.load`가 없거나 `toolbar.enabled`가 아니거나 `toolbarParams: false`이면 생성 시 오류입니다. 직접 호출할 때는 `search: () => grid.searchRemote({})`로도 같은 효과를 낼 수 있습니다.

`null`은 `before*` 이벤트로 취소되었거나(조회는) 더 새로운 조회에 밀려 결과가 반영되지 않았음을 뜻합니다. 실패는 `DataSourceError`(`code`: `HTTP`, `NETWORK`, `TIMEOUT`, `ABORT`, `INVALID_RESPONSE`, `UNSAVED_CHANGES`, `BUSY`, `CONFIG`, `UNSUPPORTED`, `DESTROYED`)로 reject 됩니다.

### 요청·응답 형식

- 조회 응답: 배열 또는 `{ items, total? }`. `responseMap(response, 'load')`으로 변환할 수 있습니다.
- 응답 필터: `responseFilter(response, operation)`는 `responseMap`보다 먼저 호출됩니다(순서: HTTP 응답 → `responseFilter` → `responseMap` → 검증). 응답 봉투(`{ code, message, data }`)를 검사해 오류로 바꾸거나 `data`만 꺼내 넘길 때 사용합니다. 반환값(또는 `Promise`)이 다음 단계에 전달되고, 던진 오류는 `DataSourceError`(일반 `Error`는 `INVALID_RESPONSE`)로 `loadError`/`saveError`/`removeError` 이벤트와 reject로 전달됩니다. 오류가 나면 `responseMap`은 호출하지 않고 기존 데이터·변경 상태를 유지합니다. HTTP 설정에만 적용됩니다.

`responseFilter`는 세 번째 인자 `info`(`{ ok, status, statusText, headers?, error? }`)도 받습니다. `info.headers`는 응답 헤더(이름은 소문자)이며 코어 Ajax 응답은 성공·오류 모두 채워집니다(예: `info.headers['x-api-message']`). 주입한 `request` 함수는 성공 응답 헤더를 제공할 수 없고, 오류는 던진 오류 객체의 `headers`가 있으면 사용합니다. 서버가 **2xx가 아닌 상태 코드(401/403/404/500 등)로 응답한 경우에도 호출**되며, 이때 `info.ok`는 `false`, `response`는 응답 본문(JSON이면 파싱한 값, 아니면 문자열)입니다. 값을 반환하면 오류가 복구되어 정상 응답처럼 이어지고, 던지면 그 오류가, `info.error`를 던지면 기본 HTTP 오류가 전달됩니다. `responseFilter`가 없으면 기존처럼 `HTTP` 오류로 reject됩니다. 연결 실패(`NETWORK`)·`TIMEOUT`·취소(`ABORT`)는 응답이 없어 `responseFilter`를 호출하지 않습니다. (오류 처리는 아래 `errorFilter`를 권장하며, `errorFilter`가 없을 때만 위 동작이 유지됩니다.)

`errorFilter(error, operation, info)`는 오류 처리를 분리한 옵션입니다. 상태 코드 오류(`HTTP`)와 연결 실패(`NETWORK`)·`TIMEOUT`에서 호출되고 취소(`ABORT`)는 호출하지 않습니다. `error`는 `DataSourceError`(`code`, `status`, `response`), `info`는 `{ status?, statusText?, headers?, data? }`(`data`는 HTTP 오류의 본문, JSON이면 파싱한 값)입니다.

- 값을 반환하면 오류가 복구되어 정상 응답처럼 `responseMap`(없으면 검증)으로 이어지며, `responseFilter`와 오류 이벤트는 호출되지 않습니다.
- 던지면 그 오류가 전달됩니다. `error`를 그대로 던지면 기본 동작이고, 일반 `Error`는 원래 오류의 `code`·`status`를 유지한 채 메시지만 바뀝니다.
- 성공 응답에는 호출하지 않고 `responseFilter`만 적용합니다. `save`/`remove`의 오류를 값으로 복구하면 성공 응답으로 처리되어 변경이 확정되므로 의도한 경우에만 복구하세요.

```ts
errorFilter: (error, operation, info) => {
  if (error.status === 401 || error.status === 440) logout();                  // 세션 만료
  if (error.status === 404 && operation === 'load') return { items: [], total: 0 }; // 조회만 빈 결과로 복구
  const apiMessage = info.headers?.['x-api-message'];
  throw new DataSourceError(error.code, apiMessage ?? MESSAGES[error.status ?? 0] ?? error.message, error.status, info.data);
}
```

```ts
import { DataSourceError } from '@daracl/grid'; // UMD에서는 일반 Error를 던져도 INVALID_RESPONSE로 변환됩니다.

dataSource: {
  load: { url: '/api/users' },
  responseFilter: (res, operation, info) => {
    if (!info.ok) {
      if (info.status === 401) { location.href = '/login'; throw info.error; } // 인증 만료
      if (info.status === 404) return { items: [], total: 0 };                 // 오류를 빈 결과로 복구
      throw new DataSourceError('HTTP', res?.message ?? info.statusText, info.status, res);
    }
    if (res.code !== 0) throw new DataSourceError('HTTP', res.message, res.code, res); // 본문 오류 코드
    return res.data;
  },
  responseMap: (data) => ({ items: data.list, total: data.total }),
}
```
- 저장 요청 본문: `{ created: [], updated: [], deleted: [] }` (변경된 행만, 내부 관리 필드와 상태값 제외)
- 삭제 요청 본문: `{ deleted: [] }`
- 저장 응답(선택): `{ idMap?: { 임시ID: 서버ID }, failed?: [ID...] }`. 본문이 없으면 전체 성공으로 처리합니다. `idMap` 반영과 `failed` 매칭은 `rowIdField`(트리는 `tree.idField`)를 지정한 경우에 가능합니다.

```ts
dataSource: {
  baseUrl: '/api',
  load: { url: '/users', method: 'GET' },
  save: { url: '/users', method: 'PUT', headers: { 'X-Mode': 'batch' } },
  headers: async () => ({ Authorization: `Bearer ${await getToken()}` }), // 요청마다 호출
  credentials: 'include',
  timeout: 10000,
  requestMap: (data, operation) => (operation === 'load' ? { ...data, v: 2 } : data),
  responseMap: (res, operation) => (operation === 'load' ? { items: res.data, total: res.total } : res),
  // fetchMode: 'fetch'      // 코어 Ajax 전송 방식 (기본 xhr)
  // request: (req) => myHttp(req) // 코어 Ajax 대신 사용할 전송 함수 (테스트·인터셉터용)
}
```

### 로딩 표시 (loader)

HTTP 설정을 사용할 때 코어 Ajax의 `loaderContainer`/`loaderOption`으로 로더를 표시합니다. 기본은 그리드 요소를 컨테이너로 **조회(load)에만** 표시하며(저장 중에도 편집을 허용하기 위함), 요청이 끝나면 코어 Ajax가 숨깁니다. 사용자 정의 함수 DataSource는 Ajax를 거치지 않으므로 `loadingChange` 이벤트로 직접 표시합니다.

```ts
dataSource: {
  load: { url: '/api/users' },
  loader: { container: '#wrap', options: { content: '조회 중...' }, operations: ['load', 'save'] }, // loader: false 이면 표시 안 함
}
```

### 사용자 정의 DataSource

`load`/`save`/`remove`에 HTTP 설정 대신 함수를 지정할 수 있으며 Public API는 동일합니다. 함수는 `AbortSignal`을 받으므로 `signal`을 요청에 전달하면 중복 조회·`destroy()` 시 요청이 취소됩니다. (`requestMap`/`responseMap`은 HTTP 설정에만 적용됩니다.)

```ts
dataSource: {
  load: async (params, signal) => {
    const res = await userApi.search(params, signal);
    return { items: res.data, total: res.total };
  },
  save: async (changes, signal) => userApi.save(changes, signal), // SaveResult 또는 void
  remove: async ({ deleted }, signal) => userApi.remove(deleted, signal),
}
```

### 이벤트

`dataSource.events`에 지정합니다. `before*`가 `false`(또는 `Promise<false>`)를 반환하면 작업이 취소됩니다. `destroy()` 이후에는 이벤트가 발생하지 않으며, 알림 이벤트 핸들러의 예외는 작업 결과에 영향을 주지 않습니다.

| 이벤트 | 인자 |
|-----|-----|
| `beforeLoad` / `load` / `loadError` | `{ params }` / `{ params, items, total }` / `{ error }` |
| `beforeSave` / `save` / `saveError` | `{ changes }` / `{ changes, summary }` / `{ error }` |
| `beforeRemove` / `remove` / `removeError` | `{ request }` / `{ request, summary }` / `{ error }` |
| `loadingChange` | `{ operation, loading }` — 진행 상태 알림. 로더 표시는 아래 `loader` 옵션 참고 |

모든 이벤트 인자에는 `grid`와 `operation`이 포함됩니다.

### 저장·삭제와 변경 상태 정책

- 저장 대상은 기존 행 상태(C/U/D)를 사용합니다. 변경이 없으면 요청하지 않습니다.
- **`deleteMode`**: `dataSource.save`를 지정하면 삭제 행을 추적해야 하므로 `deleteMode`는 지정하지 않으면 `soft`로 동작하고, `hard`를 명시하면 생성 시 오류입니다.
- 저장하지 않은 신규 행을 삭제하면 서버 요청 없이 로컬에서만 제거합니다. `removeRemote()`도 신규 행은 요청 없이 제거합니다.
- 저장 실패 시 상태가 유지되어 `save()`를 다시 호출할 수 있습니다. `failed`로 보고된 행도 상태를 유지합니다.
- 저장 요청 이후에 다시 편집한 행은 확정하지 않고 변경 상태를 유지합니다(저장 중이던 신규 행은 이후 수정으로 취급). 저장·삭제가 진행되는 동안 다른 `save`/`removeRemote`/`load`는 `BUSY`로 거부됩니다.
- 저장·서버 삭제가 성공하면 Undo/Redo 이력을 초기화합니다(서버 상태와 어긋난 되돌리기를 막기 위함).
- 트리는 신규를 부모 → 자식 순, 삭제를 자식 → 부모 순으로 전달합니다. 그룹의 합계 행은 저장 대상이 아닙니다.
- **미저장 변경 충돌**: 변경이 있으면 `load`/`searchRemote`/`reload`가 `UNSAVED_CHANGES`로 거부됩니다. 버리려면 `{ discardChanges: true }`를 전달합니다. 조회 응답을 기다리는 동안 새로 편집한 경우에도 결과를 반영하지 않고 거부합니다.
- 더 새로운 조회가 시작되면 이전 요청을 `AbortSignal`로 취소하고, 늦게 도착한 이전 응답은 무시합니다.

### 서버 페이징

```ts
{
  footer: { enabled: true, paging: { enabled: true } },
  dataSource: {
    paging: { mode: 'server', pageSize: 100 },
    load: { url: '/api/users', method: 'POST' },
  },
}
```

조회 조건에 `page`, `pageSize`가 추가되고(`requestMap`으로 이름 변경 가능) 응답의 `total`로 페이지 정보를 만듭니다. 이 모드에서는 `footer.paging.callback`을 직접 지정할 수 없으며, 클라이언트 검색·정렬은 현재 페이지에만 적용됩니다.

### 지원하지 않는 조합

조용히 잘못된 결과가 표시되지 않도록 생성 시 `DataSourceError`를 던집니다.

- `dataSource.sorting.mode: 'server'`, `dataSource.filtering.mode: 'server'` (아직 미지원)
- 서버 페이징 + `tree` 또는 `groupingFields` (현재 페이지만으로는 트리 구조·그룹 합계가 부정확)
- `dataSource.save` + `deleteMode: 'hard'`

`uitest/remote.html`에서 메모리 Mock 서버로 동작을 확인할 수 있습니다.

## 테마

색상 값은 [`@daracl/ui-style`](https://www.npmjs.com/package/@daracl/ui-style) 의 테마 변수(`--dui-*`)를 사용합니다.
light / dark 값이 낮은 우선순위(`:where`, 특이도 0)의 기본값으로 그리드 CSS 에 들어 있어, **별도 설정 없이** `data-daracl-theme` 속성과 OS 다크 설정(`prefers-color-scheme`)이 동작합니다.
앱이 `@daracl/ui-style/theme-vars.css` 를 로드하거나 `:root` 에 `--dui-*` 값을 지정하면 그 값이 항상 우선합니다. (앱 전체의 색을 바꾸거나 다른 컴포넌트와 테마를 공유할 때 로드)

```js
// 페이지 전체를 dark 로 전환
document.documentElement.setAttribute('data-daracl-theme', 'dark');

// (선택) 앱 전체 테마 변수를 공유하려면
import '@daracl/ui-style/theme-vars.css';
```

그리드 하나만 다른 테마로 표시하려면 `theme` 옵션 또는 `setTheme()` 을 사용합니다. 그리드 루트(`.daracl-grid`)에 `data-daracl-theme` 속성이 지정되며, `setTheme('')` 로 해제하면 상위 테마를 따릅니다. (`dg-light` / `dg-dark` 클래스는 더 이상 사용하지 않습니다.)

> ui-grid 전용 색상(헤더 그라데이션, 요약 행 등)은 `--dg-*` 변수로 제공되며 그리드 CSS 에 포함되어 있습니다.
> `--bar-positive-bg` / `--bar-negative-bg` 는 `--dui-bar-positive-bg` / `--dui-bar-negative-bg` 로 이름이 바뀌었습니다.

## 개발

Node.js `^20.19.0 || >=22.12.0`과 Yarn `1.22.22`를 사용합니다. 원하는 디렉터리에 저장소를 받은 뒤 아래 명령을 실행합니다. core 저장소를 함께 받거나 개인 경로·환경 변수를 설정할 필요는 없습니다.

```sh
git clone https://github.com/daracl/ui-grid.git
cd ui-grid
yarn install
yarn dev        # vite 개발 서버 실행, /uitest/index.html 자동 오픈
yarn typecheck  # 산출물 없이 TypeScript 검사
yarn test       # Jest 유닛 테스트
yarn build      # 배포용 빌드 (ESM/CJS + UMD)
yarn docs:gen   # typedoc API 문서 생성
```

기능별 수동/시각 테스트 페이지는 `uitest/*.html`에서 확인할 수 있습니다(편집, 트리, 정렬, 검색, 페이징, 컨텍스트 메뉴, 행 이동 등).

### core 공통 모듈 개발

공통 함수는 `@daracl/core@0.0.11`의 공개 진입점 `@daracl/core/utils`를 참조합니다. 일반적인 설치·개발·테스트·빌드는 설치된 패키지만 사용하며 형제 폴더를 탐색하거나 `node_modules`를 교체하지 않습니다. TypeScript도 패키지의 배포 타입을 사용합니다.

공유 스타일은 현재 SCSS의 테마 mixin을 제공하는 배포 버전 `@daracl/ui-style@0.0.6`으로 고정합니다. 스타일 저장소의 로컬 연결도 필요하지 않습니다.

`datetimepicker@0.0.13`의 peer 범위가 `^0.0.5`로 제한되어 있어 npm은 해당 패키지의 core 의존성만 `overrides`로 현재 core 버전에 맞춥니다. datetimepicker가 사용하는 `leftPad`, `leftPadClamp`, `isNumeric`, `isFunction`은 core 0.0.9에서도 제공합니다. Yarn 1은 peer 범위 경고를 표시할 수 있습니다. `--force`나 `--legacy-peer-deps`는 필요하지 않습니다.

ESM/CJS 빌드는 이 진입점을 외부 의존성으로 유지하고, UMD 빌드는 사용하는 core 함수를 포함합니다. core 전체의 전역 등록·스타일을 가져오지 않도록 공통 함수는 루트 진입점 대신 utils에서 named import합니다. 숫자 문자열 판별, 빈 값 판별, 배열 복사 및 깊은 복사·병합처럼 의미가 다른 처리는 그리드의 기존 계약을 유지합니다.

core 자체를 함께 수정할 때만 선택적으로 `yarn core:link`를 실행합니다. 이 명령은 형제 디렉터리의 package.json에서 이름이 `@daracl/core`인 체크아웃을 찾아 연결하고 기존 설치를 `.tmp/core-package-*`에 보관합니다. 폴더명·개인 절대 경로는 공유 설정에 넣지 않습니다. 체크아웃이 여러 개이거나 다른 곳에 있다면 실행 환경의 `DARACL_CORE_ROOT`로 선택할 수 있습니다.

연결된 core가 개발용 `daracl-source` export를 제공하면 Vite와 Jest는 해당 TypeScript 소스를 사용합니다. Vite가 소스를 감시하므로 저장하면 HMR 또는 새로고침이 동작합니다. IDE 타입 검사·선언 생성에는 core의 배포 타입이 필요하므로 core에서 먼저 빌드하고 공개 타입 변경 시 다시 빌드합니다. 배포 전에는 연결을 해제하고 패키지 설치 상태에서 검증합니다.

```sh
yarn test:core-link  # 선택적 연결 도구 검증
yarn typecheck
yarn test --runInBand
```

위 명령은 `npm install`, `npm run dev`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build`로도 실행할 수 있습니다. 공통 모듈을 갱신할 때는 core를 먼저 배포하고 `dependencies`의 버전을 명시적으로 변경합니다.

## License

Daracl is under [MIT License](./LICENSE).

### CSV 내보내기

목록·페이징·그룹·rowSpan·차트·트리 그리드에서 같은 `exportCsv()` API를 사용합니다. 유형별 다운로드 예제는 `uitest/csv-export.html`입니다.

외부 라이브러리 없이 `src/export/csv`에서 CSV를 생성합니다. `exportCsv()`는 다운로드한 `Blob`을 반환합니다.

```ts
await grid.exportCsv({ fileName: 'export.csv' });
await grid.exportCsv({ selectedOnly: true, includeHiddenColumns: true });
await grid.exportCsv({ visibleOnly: true, delimiter: ';', encoding: 'utf-16le' });
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `fileName` | `export.csv` | 다운로드 파일명 |
| `encoding` | `utf-8` | `utf-8`, `utf-16le` 지원. 다른 인코딩은 오류 |
| `bom` | `true` | 인코딩에 맞는 BOM 추가 |
| `delimiter` | `,` | 필드 구분 문자 |
| `quote` | `"` | 필드 감싸기 문자. 내부 문자는 두 번 기록 |
| `lineEnding` | `\r\n` | `\r\n`, `\n`, `\r` 지원 |
| `includeHeader` | `true` | 컬럼 라벨 출력, 라벨이 없으면 필드명 |
| `includeHiddenColumns` | `false` | 숨김 컬럼 포함. 보조 컬럼 제외 |
| `selectedOnly` | `false` | 선택 영역에 포함된 행만 출력. 체크 행과 별개 |
| `visibleOnly` | `false` | 현재 뷰의 행만 출력. 트리의 접힌 하위 행 제외 |
| `nullValue` | `''` | null·undefined 대체 문자열 |
| `useFormatter` | `true` | 그리드 표시 포맷·라벨 적용. false이면 원본 필드 값 |
| `escapeFormula` | `true` | 수식 또는 제어 문자로 시작하는 문자열에 작은따옴표 추가 |

기본으로 모든 실제 데이터 행을 내보내며 트리의 접힌 하위 행도 포함합니다. 그룹 소계·총계 같은 가상 행은 제외합니다. `visibleOnly`는 스크롤 영역이 아닌 현재 뷰(검색·페이지·접기 적용) 기준이며, `selectedOnly`와 함께 지정하면 두 조건을 모두 만족하는 행만 출력합니다. CSV는 셀 스타일·트리 들여쓰기·차트를 지원하지 않습니다.

CSV 코드는 호출 시 로드합니다. UMD 배포 시 메인 스크립트 옆에 `daracl.grid.csv.min.mjs`(비압축은 `daracl.grid.csv.mjs`)를 함께 배포합니다. ESM/CJS는 생성된 청크 파일을 함께 배포합니다.

### JSON 내보내기

```ts
await grid.exportJson({ fileName: 'data.json' });
await grid.exportJson({ selectedOnly: true, includeHiddenColumns: true });
await grid.exportJson({ visibleOnly: true, useFormatter: true, space: 0 });
```

목록·그룹·트리에서 실제 데이터 행을 필드명 기준의 객체 배열로 내보내고 `Blob`을 반환합니다. 트리는 접힌 하위 행까지 포함하는 평탄한 배열이며, 그룹 합계 가상 행·보조 컬럼·내부 행 ID와 상태는 제외합니다. 원본 데이터와 화면 상태는 변경하지 않습니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `fileName` | `export.json` | 다운로드 파일명 |
| `space` | `2` | 들여쓰기 공백 수 0~10. 0은 압축 출력 |
| `includeHiddenColumns` | `false` | 숨김 열 포함 |
| `selectedOnly` | `false` | 선택된 행만 출력 |
| `visibleOnly` | `false` | 현재 뷰의 행만 출력. 페이지·검색·트리 접기 반영 |
| `useFormatter` | `false` | true이면 그리드 표시 문자열 사용 |

기본은 숫자·boolean·배열·객체 값을 유지하며 누락된 필드·undefined는 null로 출력합니다. Date 등은 표준 JSON.stringify 규칙을 따르고, 순환 참조·BigInt처럼 JSON으로 변환할 수 없는 값은 오류를 전달합니다. 두 행 옵션을 함께 지정하면 교집합을 출력합니다.

코드는 exportJson 호출 시 로드합니다. UMD 배포 시 메인 스크립트 옆에 `daracl.grid.json.min.mjs`(비압축은 `daracl.grid.json.mjs`)를 함께 배포합니다. ESM/CJS는 생성된 청크를 함께 배포합니다.
### 툴바 파일 다운로드

`renderer.type: 'exportFile'`은 `renderer.listItem`에서 형식을 고르는 드롭다운과 다운로드 버튼을 표시합니다. 선택만으로는 내보내지 않으며 버튼을 눌러 실행합니다. 형식은 단일 선택이며 `excel`/`xlsx`, `csv`, `json`, `pdf`를 지원합니다. 목록의 `labelField`·`valueField`와 목록 콜백은 기존 dropdown 규칙을 따릅니다.

```ts
toolbar: {
  enabled: true,
  items: [[{
    position: 'left',
    children: [{
      name: 'fileFormat',
      label: '파일 형식',
      width: 280,
      defaultValue: 'excel',
      renderer: {
        type: 'exportFile',
        downloadLabel: '다운로드',
        listItem: {
          list: [
            { label: '엑셀', value: 'excel' },
            { label: 'CSV', value: 'csv' },
            { label: 'JSON', value: 'json' },
            { label: 'PDF', value: 'pdf' },
          ],
        },
        exportOptions: {
          excel: { fileName: 'sales.xlsx', sheetName: '매출' },
          csv: { fileName: 'sales.csv' },
          json: { fileName: 'sales.json', space: 2 },
          pdf: { fileName: 'sales.pdf', orientation: 'landscape' },
        },
      },
    }],
  }]],
}
```

각 형식의 `exportOptions`는 해당 `exportExcel`/`exportCsv`/`exportJson`/`exportPdf` 옵션을 사용합니다. 다운로드 중에는 중복 실행을 막고, 실패하면 버튼 문구와 툴팁으로 오류를 알립니다. `getToolbarValues`·`setToolbarValues` 및 `change` 콜백은 기존 드롭다운처럼 선택 값 배열을 사용합니다. 예제: `uitest/toolbar-export-file.html`.
`exportFile`의 기본 문구는 기존 `DaraGrid.message()` 전역 메시지 또는 `DaraGrid.create()`의 세 번째 메시지 인수로 설정합니다. `renderer.downloadLabel`과 필드 `label`을 지정하면 해당 문구가 우선합니다. 드롭다운 항목 라벨은 `renderer.listItem`에서 직접 지정합니다.

| 다국어 키 | 기본 문구 |
| --- | --- |
| `export.format` | 내보내기 형식 |
| `export.download` | 다운로드 |
| `export.creating` | 파일 생성 중 |
| `export.completed` | 다운로드 완료 |
| `export.failed` | 다운로드 실패 |
| `export.unsupportedFormat` | 내보내기 형식을 선택하세요. 지원 형식: excel, xlsx, csv, json, pdf |

내보내기 API가 전달한 오류 원인은 원문을 유지하고, 실패 안내 문구만 다국어 메시지를 사용합니다.
### 컨텍스트 메뉴 복사·파일 내보내기

```ts
contextMenu: {
  items: [
    { key: 'copy', label: '복사', hotkey: 'Ctrl+C' },
    {
      key: 'exportFile', label: '파일 다운로드',
      exportOptions: { csv: { fileName: 'sales.csv' } },
      children: [
        { key: 'excel', label: '엑셀' },
        { key: 'csv', label: 'CSV' },
        { key: 'pdf', label: 'PDF' },
        { key: 'json', label: 'JSON' },
      ],
    },
  ],
}
```

`copy`는 현재 선택 영역을 복사합니다. `exportFile`의 하위 항목은 `excel`/`xlsx`, `csv`, `pdf`, `json` 키에 따라 다운로드합니다. `exportOptions`는 툴바와 같은 형식이며 부모와 하위 항목 설정을 병합하고 하위 설정을 우선합니다. 파일명이 없으면 GridOptions.title, 제목도 없으면 형식별 기본 파일명을 사용합니다.

항목에 직접 지정한 callback은 기본 동작보다 우선합니다. 기본 복사·다운로드를 처리한 항목에는 공통 callback을 중복 호출하지 않으며, 일반 사용자 메뉴는 기존 공통 callback으로 처리합니다. 비활성 항목·비활성 부모 아래의 항목은 실행하지 않습니다. 다운로드 중 중복 실행을 막고 실패 원인은 콘솔에 기록합니다.
컨텍스트 메뉴는 `{ key: 'copy' }`, `{ key: 'exportFile', children: [{ key: 'csv' }, { key: 'pdf' }] }`처럼 키만 지정할 수도 있습니다. 메뉴 생성 시 항목 사본에 기본 label과 callback을 채워 기존 콜백 실행 경로를 사용합니다. 원본 배열은 변경하지 않으며 직접 지정한 label·callback이 우선합니다. 기본 Copy / Export file 문구는 `context.copy`, `context.exportFile` 다국어 메시지로 변경할 수 있습니다.
### 그룹 집계 설정

`groupSummaryFields`로 그룹 소계·총계에 표시할 컬럼과 집계 방식을 지정합니다.

```ts
groupingFields: ['department'],
groupSummaryFields: [
  { field: 'amount', expression: 'sum' },
  { field: 'unitPrice', expression: 'avg' },
  { field: 'orderCount', expression: 'count' },
  { field: 'profit', expression: (items) => items.reduce((total, item) => total + item.amount - item.cost, 0) },
],
showGroupSummary: true,
showGrandSummary: true,
```

field는 집계 결과를 표시할 컬럼명입니다. expression은 sum, avg, count, min, max 또는 함수를 사용합니다. 함수는 유한한 숫자를 반환해야 합니다. 함수에는 소계의 해당 그룹 행 배열 또는 총계의 전체 집계 대상 행 배열을 전달하며 가상 소계·총계 행은 포함하지 않습니다. 행 값 수정 시 함수 집계도 갱신합니다.

count는 빈 값과 관계없이 행 수를 셉니다. 숫자 집계는 숫자 문자열을 허용하며 null·undefined·빈 문자열·유효하지 않은 숫자를 제외합니다. 숫자 값이 없으면 0입니다. 그룹 결과는 화면·선택 복사·PDF·Excel에 반영됩니다.

groupSummaryFields가 빈 배열이면 그룹 집계 행을 표시하지 않습니다. showGroupSummary·showGrandSummary는 집계 방식과 무관하게 그룹별·전체 집계 행의 표시 여부를 제어합니다.

### 빌드 설정과 검증

Vite 설정은 `vite.config*.mjs`, 공통 설정은 `vite.common.mjs`를 사용합니다. 패키지 전체를 ESM으로 변경하지 않고 설정 파일만 ESM으로 실행합니다.

- `npm run build`: `dist`를 정리하고 전체 배포 파일을 생성합니다. 선언 생성과 번들 작업을 병렬로 실행하며 UMD도 esbuild로 압축합니다.
- `npm run build:verify`: `.tmp/build-*`에 전체 배포 파일을 생성하고 필수 파일·폰트·라이선스, 압축/비압축 UMD 렌더링, 선언 파일의 별칭 변환을 검사합니다. 기존 `dist`는 변경하지 않습니다.
- `npm run test:scripts`: 설정·복사·경로 보호·core 연결 테스트를 실행합니다.
- `npm run build:tsc` / `npm run dts:gen`: 빌드 전용 TypeScript 설정으로 선언을 생성하고 경로 별칭을 변환합니다.
- `npm run audit:security` / `npm run audit:security:all`: 배포 의존성 / 전체 의존성의 보안 감사를 실행합니다. 결과는 사용하는 lockfile과 설치 상태에 따라 달라집니다.

public 자산은 전체 빌드 마지막에 한 번 복사하며 PDF 한글 폰트와 `OFL.txt`를 포함합니다. 개발 서버는 현재 저장소와 실제 연결된 core 소스 경로만 허용합니다. `tsconfig-build.json`의 전역 타입 제한은 테스트 설정에는 적용하지 않습니다.
