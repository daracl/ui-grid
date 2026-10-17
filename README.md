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
| sumFields | 그룹 소계/전체 합계를 계산할 숫자 필드 목록 | `[]` |
| showGroupSum / showGrandSum | 최하위 그룹 소계 / 전체 합계 행 표시 여부 | `true` |
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
| `exportPdf(options?)` | 현재 뷰의 전체 행과 그룹 합계 행을 PDF로 다운로드 |
| `exportExcel(options?)` | 현재 뷰의 표시 값·그룹 합계·rowSpan을 XLSX로 다운로드 |
| `exportCsv(options?)` | 실제 데이터 행을 CSV로 다운로드 |
| `exportJson(options?)` | 필드명을 키로 하는 JSON 행 배열 다운로드 |
| `setTheme(themeName)` / `setStyle(styleName)` | 테마/스타일 변경 |
| `expandAll()` / `collapseAll()` | 트리 모드 전체 펼치기/접기 |
| `copyData()` | 선택 영역 클립보드 복사 |
| `destroy()` | 그리드 인스턴스 제거 |

전체 API는 [`src/DaraGrid.ts`](./src/DaraGrid.ts)와 [typedoc 문서](https://ui.daracl.com)를 참고하세요.

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