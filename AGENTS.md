# AGENTS.md

이 문서는 현재 소스와 설정에서 확인한 사실을 기록한다.

## 1. Project Overview

- `@daracl/grid` v`0.0.19`: UI 프레임워크에 종속되지 않는 브라우저용 TypeScript 데이터 그리드 라이브러리. MIT License.
- 주요 기능: 목록·트리·그룹 데이터 표시, 그룹 소계·총계, 셀 편집과 검증, 정렬·검색·페이징, 행·셀 선택과 체크, 고정 컬럼, 행 이동, rowSpan, 툴바·컨텍스트 메뉴·요약, 테마, 클립보드, Undo/Redo, PDF 다운로드.
- 서버 애플리케이션이 아니다. DB 연결, ORM, SQL 파일, 서버 Controller/REST endpoint는 없다. 행 CRUD는 브라우저 메모리에서 수행한다.

## 2. Technology Stack

버전은 `package.json`의 선언 범위 기준이다. 설치된 버전과 동일하다고 가정하지 않는다.

| 구분 | 기술 및 선언 버전 |
| --- | --- |
| 구현 | TypeScript `^5.1.6`, JavaScript 빌드 설정, HTML 예제, SCSS |
| 빌드 | Vite `^5.4.0`, Sass `^1.80.2`, Terser `^5.47.0`, tsc-alias `^1.9.5` |
| PDF | pdfkit `^0.20.2`, @types/pdfkit `^0.17.6` |
| Daracl | @daracl/core `^0.0.5`, @daracl/datetimepicker `^0.0.13` — 현재 devDependencies에 선언 |
| 테스트 | Jest `^29.0.0`, ts-jest `^29.4.6`, jest-environment-jsdom `^29.7.0`, @playwright/test `^1.55.1` |
| 스타일 검사 | ESLint `^8.40.0`, @typescript-eslint `^5.59.5`, Prettier `^2.8.8` |
| 문서 | TypeDoc `^0.26.7` |
| 패키지 관리 | packageManager는 Yarn `1.22.22`; npm scripts와 로컬 package-lock.json도 존재 |

- `tsconfig.json`: `strict: true`, `strictPropertyInitialization: false`, `skipLibCheck: true`, target `es2017`, module `esnext`, DOM lib, declaration 생성.
- `jsx: react-jsx` 설정과 React 관련 lint 의존성이 있어도 실제 `src/` 구현은 `.ts`이며 React 컴포넌트 구조가 아니다.
- `src/indexVender.ts`는 DateTimePicker와 해당 SCSS를 연결한다. 파일명 철자도 실제 경로를 따른다.

## 3. Project Structure

```text
src/
  DaraGrid.ts                         공개 API
  index.ts / index.umd.ts / global.ts 배포 진입점·전역 등록
  indexVender.ts / docIndex.ts        외부 UI 연결·문서 진입점
  defaultGridOption.ts                옵션 기본값·병합
  defaultGridConfig.ts                인스턴스 내부 상태 초기화
  constants.ts / constant*.ts         상태·스타일·아이콘·렌더러 등록
  types/                             옵션·필드·상태·이벤트 등의 .d.ts
  element/                           DaraElement DOM 래퍼
  event/                             이벤트 관리·포인터 세션·핸들러
  service/                           DataManager 및 목록·트리·그룹·History 관리
  view/
    GridMain.ts                      인스턴스 조립·수명 관리
    builder/                         구조·필드·크기 계산·렌더러 생성
    main/
      body/                          본문 상태·템플릿·셀·선택·그리기
        event/                       클릭·키보드·붙여넣기·행 이동
      header/                        헤더·정렬·도움말·리사이즈
      scroll/                        수평·수직 스크롤
      Summary.ts / ContextMenu.ts    요약·메뉴
    toolbar/ / footer/ / search/      툴바·페이징·검색
  renderer/
    view/ / edit/ / toolbar/ / summary/  역할별 렌더러
  selection/                         선택 영역 계산
  rule/                              공통·문자·숫자·정규식 검증
  util/                              DOM·이벤트·그리드·검색·스타일·배열 등
  format/                            숫자 포맷
  pdf/                               표 데이터 구성·PDF 변환·폰트 URL·타입 보완
  worker/                            Blob 기반 itemWorker 구현
style/
  daracl.grid.scss                   스타일 진입점
  abstracts/ / base/ / components/   변수·mixin·기본·공통 컴포넌트
  themes/                            light·dark 테마
  views/                             main·toolbar·footer·hidden·style·메뉴
test/
  format/ / util/ / service/         단위 테스트
  integration/ / pdf/ / __mocks__/  통합·PDF 테스트·폰트 URL mock
uitest/                              기능별 수동 HTML 테스트, data/, asset/
example/                             DOM·헤더·그리드 구조 실험 HTML
asset/                               이미지·국기
public/assets/                       NotoSansKR 폰트와 OFL.txt
docCss/                              TypeDoc customStyle.css
docs/ / dist/                        생성 문서·배포 산출물
.vscode/ / .claude/                  로컬 도구 설정 디렉터리
```

루트에는 `package.json`, TypeScript/Jest/Vite 설정, `.prettierrc`, `.eslintrc.json`, README 2종, `DOC-README.md`, `CLAUDE.md`, `runBuild*.bat`, 과거 빌드용 `build.js`도 있다. 단일 패키지 구조이며 workspace별 하위 패키지는 없다. 생성물과 의존성인 `docs/`, `dist/`, `node_modules/`를 소스 원본으로 취급하지 않는다.

## 4. Architecture & Module Responsibilities

### 공개 API와 인스턴스 조립

- `src/index.ts`는 `DaraGrid`, `GridOptions`, `FieldItem`, `PdfExportOptions`를 export하고 그리드 SCSS와 `global.ts`를 import한다.
- `global.ts`와 UMD 진입점은 브라우저에서 `window.Daracl.grid`를 등록한다. UMD 진입점에는 DateTimePicker 배포 CSS import도 있다.
- `DaraGrid`는 `create`, `instance`, `setItems`, 선택·편집·검색·History·PDF 등의 공개 API를 제공하고 대부분 `GridMain`에 위임한다.
- `GridMain`은 옵션 정규화, 내부 `Config`, 인스턴스 Map, DOM, 하위 뷰, resize 관찰, 갱신과 해제를 관리한다. DataManager 선택 순서는 `groupingFields` → `tree` → 목록이다.
- `StructureBuilder`가 `FieldBuilder`, `FieldWidthCalculator`, `DimensionCalculator`, `RendererFactory`를 조합한다. 필드 정보와 DOM 구조·폭 계산은 함께 검토해야 한다.

### 데이터와 렌더링 흐름

```text
GridOptions → initGridOptions / initConfig → GridMain
  → DataManager: 원본 행·rowMap·ViewItem·정렬·검색·상태·History
  → StructureBuilder: 필드·크기·DOM·렌더러
  → Header / Body / Toolbar / Footer / Scroll / Summary / ContextMenu
사용자 이벤트 → Handler → 편집 검증·변경 콜백 → DataManager → 본문 갱신
```

- `DataManager`는 추상 클래스. `ListDataManager`, `TreeDataManager`가 상속하고, `GroupDataManager`는 `ListDataManager`를 상속한다. 그룹 합계용 가상 행과 원본 데이터 행을 구별한다.
- 행 식별·C/U/D/R 상태는 `constants.ts`의 `ROW_FIELD`, `ItemStatusMap` 등을 사용한다. `ViewItem`은 표시용 행 메타데이터이며 원본 행 객체와 다르다.
- `HistoryManager`는 변경 이력과 선택 정보를 저장한다. 선택 복원은 row index 대신 `RowId`를 기준으로 한다. 여러 셀 변경은 `beginHistory`/`commitHistory`로 묶는다.
- `rollbackHistory`가 연결하는 `HistoryManager.rollback()`은 미확정 이력을 버릴 뿐 실제 데이터를 되돌리지 않는다. DB transaction이나 데이터 원자성을 보장하는 기능이 아니다.
- `Body`는 `BodyContext`, `BodyTemplate`, `BodyCell`, `BodySelection`, `BodyEvent`에 위임한다. grouping 또는 rowSpan 옵션이 있으면 `GroupBodyRenderer`, 그 외에는 `SimpleBodyRenderer`를 사용한다.
- `DataSearch`를 `SimpleDataSearch`와 `ApiDataSearch`가 구현한다. `ApiDataSearch`도 `cfg.dataManager.search()`를 호출하는 로컬 검색 API이며 HTTP 클라이언트가 아니다.

### 확장 인터페이스와 공통 모듈

- `CellRenderer` → `ViewCellRenderer` / `EditCellRenderer`; 편집 계열에는 `TextAbstractRenderer`도 있다. 별도 추상 클래스는 `ToolBarRenderer`, `SummaryRenderer`, `BodyRenderer`, `PdfRenderer`.
- `constantRenders.ts`의 `VIEW_RENDERER`, `EDIT_RENDERER`, `ASIDE_RENDERER`, `TOOLBAR_RENDERER`가 type 문자열과 구현을 연결한다. 구현 파일 존재만으로 지원 타입이 되지 않는다.
- `GridOptions`, `FieldItem`, `Config`, `CellInfo`, `ViewItem`, `ValidResult`, 이벤트·렌더러 타입은 주로 `src/types/*.d.ts`에 있다. History/PDF/포인터 타입은 해당 구현 모듈에도 정의한다.
- `DaraElement`와 `EventManager`가 DOM·이벤트 처리를 지원한다. `PointerHandler`/`BasePointerHandler`, `PointerContext`, `PointerSession`은 드래그 상태·동작을 분리한다.
- 공통 처리 우선 탐색 위치: `util/utils.ts`(타입 판별·merge·배열·debounce·클립보드), `domUtils.ts`, `eventUtils.ts`, `gridUtils.ts`, `rendererUtils.ts`, `styleUtils.ts`, `searchUtils.ts`, `formatUtils.ts`, `pagingUtil.ts`, `mathUtils.ts`, `Language.ts`.
- `htmlTemplate.ts`의 `html`은 문자열 조립 helper이며 escaping을 보장하지 않는다. production 빌드는 `html` tagged template을 별도 축약한다.
- PDF 흐름: `DaraGrid.exportPdf()` → `SimplePdfRenderer`/`GroupPdfRenderer` → `PdfTableData` → `PdfConverter` → `Blob`·다운로드. PDFKit 표준 폰트 등록 및 한글 폰트 fetch를 사용한다. 임시 DOM 스타일 측정은 `finally`에서 정리한다.
- `worker/itemWorker.ts`에 Worker factory가 있지만 현재 `src/` 내 호출부는 없다. 주 데이터 처리가 Worker로 수행된다고 가정하지 않는다.

## 5. Coding Conventions

아래는 기존 설정·구현에서 확인된 관례다.

- Prettier: 공백 2칸, 세미콜론, single quote, 폭 120, trailing comma `all`, bracket spacing, arrow parameter 괄호, LF.
- ESLint: `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `prettier`; `no-console: warn`. package scripts에 lint/format 명령은 없다.
- `@/`는 `src/`, `@t/`는 `src/types/`. 상대 import도 혼용하므로 주변 코드에 맞춘다. 타입 import의 `import type` 사용은 일괄 강제되지 않는다.
- 클래스에 `public`/`private`/`protected`, `readonly`, 추상 메소드를 사용한다. 반환 타입은 명시·추론을 혼용한다.
- `interface`, union, optional property, `Record`, `Map`, `Set`, `as const`와 indexed access type을 사용한다. `I` 접두사 인터페이스 관례는 없다.
- 유틸리티에는 `<T>`, `<T extends Record<string, unknown>>`, `Parameters<T>` 등을 사용한다. 행과 renderer 값에 `any`도 남아 있어 전체가 강하게 타입화되어 있다고 가정하지 않는다.
- 주석은 한국어·영어 혼용. 공개 API와 추상 클래스에 `/** */`, `@param`, `@returns`, 일부 `@class`/`@typedef`/`@interface`를 사용하고 내부 설명은 `//`도 사용한다.
- 비동기: PDF는 `async`/`await`·Promise, 클립보드는 Promise·fallback, 화면 갱신·스크롤은 `requestAnimationFrame`과 debounce를 사용한다.
- 이벤트: `EventManager`는 WeakMap/Set으로 리스너를 추적하고 selector 위임과 namespace 문자열을 지원한다. 리스너가 `false`를 반환하면 기본 동작과 즉시 전파를 막는다. 편집 변경 콜백도 `false`로 취소할 수 있다.
- SCSS는 `_name.scss` partial, `_index.scss` 집계, `@use`와 mixin 중심이다. CSS 클래스는 주로 `dg-`, 루트는 `.daracl-grid`이며 테마는 CSS 변수·mixin으로 구성한다.
- Jest는 `describe`/`it`/`expect`, `jest.fn`/`jest.mock`을 사용한다. 통합 테스트는 DOM·Canvas·PointerEvent·`APP_VERSION`을 보완하고 생성한 grid를 `destroy()`한다.

## 6. Naming Conventions

| 대상 | 실제 관례·예 |
| --- | --- |
| 클래스·인터페이스·타입 | PascalCase: `GridMain`, `FieldItem`, `RowId` |
| 메소드·함수·변수 | camelCase: `setChangeValue`, `createHTMLElement`, `rowMap` |
| 상수 | 주로 UPPER_SNAKE_CASE: `ROW_FIELD`, `VIEW_RENDERER`; `ItemStatusMap` 같은 PascalCase 상수 객체도 존재 |
| boolean | `is*`, `has*`, `supports*`, `enabled*` 등의 기존 이름 사용 |
| 내부 필드 메타데이터 | `$renderer`, `$editRenderer`, `$isAside`; `_editable` 같은 예외도 존재 |
| 클래스 파일 | 대체로 클래스명과 같은 PascalCase `.ts` |
| 함수 모듈·디렉터리 | `domUtils.ts`, `formatNumber.ts`, `service/`, `renderer/edit/` |
| 테스트·수동 페이지 | `*.test.ts`, `uitest/`의 기능별 camelCase·kebab-case HTML 혼용 |

기존 철자 `ContenxtMenu.d.ts`, `indexVender.ts`, 공백이 포함된 `HelpButtonEvent .ts`, `KeydownEvent .ts`를 임의로 정정하거나 경로를 추정하지 않는다.

## 7. Development Guidelines

다음은 분석 결과에 기반한 작업 지침이다.

- 옵션 변경 시 `GridOptions`/`FieldItem` → `defaultGridOption.ts` → `defaultGridConfig.ts` → 소비 모듈 순으로 영향 범위를 확인한다. 공개 옵션과 내부 `Config`의 역할을 유지한다.
- 렌더러 추가·변경 시 추상 계약, 해당 하위 디렉터리의 `index.ts`, 등록 맵, `RendererFactory`, 관련 타입과 SCSS를 함께 확인한다. 툴바는 별도 생성·등록 경로도 확인한다.
- 데이터 변경은 기존 DataManager 경로를 재사용하여 CUD 상태, History, 검색·정렬, 선택, 그룹 합계와 화면 갱신을 일관되게 처리한다.
- DOM 변경 시 고정 좌·중앙·우 영역, 스크롤과 선택 계산, event delegation selector, 테마와 숨김 레이어의 영향을 확인한다.
- 리스너·observer·animation·임시 DOM을 추가하면 기존 `destroy()`/취소 경로와 연결하고 여러 grid 인스턴스의 독립성을 확인한다.
- 동작 변경은 관련 Jest 테스트와 해당 `uitest/*.html`을 선택해 검증한다. 새 테스트·예제 파일 추가는 요청 범위에 필요한 경우로 한정한다.
- 새로운 설명·주석은 특별한 요청이 없으면 한국어로 작성하고 기술명·API 이름은 원문을 유지한다.

### 설정과 환경

- Vite와 TypeScript/Jest가 같은 경로 별칭을 각각 정의한다. 별칭 변경은 세 설정의 일관성이 필요하다.
- `vite.common.js`의 `mode === 'production'` 분기로 배너·minify가 달라진다. `APP_VERSION`은 package 버전을 빌드 시 주입한다. 별도 환경별 DB 설정이나 `.env` 파일은 확인되지 않는다.
- ESM/CJS는 `vite.config.js`, UMD는 `vite.config.umd.js`. production은 `dist`, development는 `dist/unmin`에 출력한 뒤 전체 빌드가 병합·정리한다.
- `tsconfig.doc.json`은 `src/docIndex.ts` → `docs/`, `docCss/customStyle.css`를 사용한다. Jest는 `jest.config.js`에서 jsdom·ts-jest·별칭과 PDF 폰트 URL mock을 설정한다. `tsconfig.test.json`을 사용한다고 가정하지 않는다.

## 8. Build & Test Commands

아래는 실제 `package.json` script 또는 설치된 도구를 사용하는 명령이다. 대응하는 `yarn <script>`도 사용 가능하다.

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | `127.0.0.1:5178`, `/uitest/index.html` 자동 열기 |
| `npm run build` | `build:escjs` → `build:umd` → `mergenclean` 전체 배포 빌드 |
| `npm run build:escjs` | ESM/CJS production·development 번들 |
| `npm run build:umd` | UMD production·development 번들 |
| `npm run build:tsc` | declaration 생성 및 tsc-alias 경로 변환; dist에 기록 |
| `npm exec -- tsc --noEmit` | 산출물을 쓰지 않는 타입 검사 |
| `npm test -- --runInBand` | Jest 전체 실행 |
| `npm test -- --runInBand test/integration/GridWorkflow.test.ts` | 특정 통합 테스트 실행 |
| `npm test -- -t "검색할 테스트명"` | 테스트명으로 선택 실행 |
| `npm run preview` | Vite 빌드 결과 미리보기 |
| `npm run docs:gen` | TypeDoc 문서 생성 |

- `npm run pwtest` script는 있지만 Playwright 설정·전용 spec은 확인되지 않는다. 준비된 E2E 검증 수단으로 간주하지 않는다.
- `runBuildDev.bat`/`runBuildProd.bat`가 호출하는 `build:dev`/`build:prod`는 현재 scripts에 없다.
- `build.js`는 없는 `webpack.common.js`, `src/index.js`와 미선언 plugin을 참조하는 과거 경로다. `dts:gen`도 없는 `src/index.js`를 참조하므로 현재 기본 빌드로 안내하지 않는다.
- `copy-html`이 참조하는 `public/index.html`은 현재 없다. 전체 빌드의 복사 결과를 무조건 성공으로 가정하지 않는다.
- `vite.config.js`의 external 항목 `@daracl/datatimepicker` 철자는 실제 의존성 `@daracl/datetimepicker`와 다르다. 관련 번들 작업에서 확인하되 요청 없이 수정하지 않는다.

## 9. Error Handling & Logging

- 잘못된 DOM·미지원 상태·PDF 옵션 등은 `Error`/`RangeError`로 알린다. 검증 실패·취소·검색 결과 없음은 기존 `false`/`null`/빈 결과 계약을 따른다.
- `searchUtils.ts`는 잘못되거나 위험한 정규식에 `console.warn` 후 텍스트 검색으로 fallback한다. 클립보드 fallback에는 `console.error`, 일부 기존 코드에는 `console.log`도 있다.
- 중앙 logger나 공통 예외 middleware는 없다. ESLint의 `no-console`은 warning이며 production UMD의 `drop_console`은 false다.
- Promise 오류 전달, callback 취소, try/finally 정리의 기존 의미를 유지한다. History rollback을 데이터 rollback으로 오해하지 않는다.

## 10. AI Agent Instructions

1. 코드 수정 전 관련 모듈, import·호출 관계, 공개 타입, 데이터·이벤트 흐름과 테스트를 먼저 분석한다.
2. 기존 아키텍처와 주변 코딩 스타일을 최대한 유지하고 기존 기능과 하위 호환성을 보장한다.
3. 불필요한 리팩터링·구조 변경·전체 포맷팅을 하지 않는다. 요청하지 않은 파일은 수정하지 않는다.
4. 기존 공통 모듈을 먼저 찾아 재사용하고, 코드 중복을 최소화하며 유지보수성을 고려한다.
5. 새로운 라이브러리는 반드시 필요한 경우에만 추가한다. 필요성과 기존 모듈로 해결되지 않는 이유를 설명한다.
6. 공개 export, API·메소드 시그니처, 옵션 키, renderer type, 전역 등록 이름을 임의로 변경하지 않는다.
7. 수정 후 가능한 범위에서 관련 타입 검사·빌드·테스트를 수행한다. UI 동작은 필요한 수동 검증을 구분해 보고한다.
8. 완료 후 변경 파일, 변경 내용, 검증 결과와 실행하지 못한 검증 및 이유를 설명한다.
9. 기존 코드와 충돌하거나 요구사항·공개 계약이 불명확하면 임의로 결정하지 않고 사용자에게 확인한다. 확인이 필요하지 않은 기존 패턴의 재사용은 진행한다.

## 11. Restrictions & Precautions

- 사용자 작업과 기존 미커밋 변경을 보존한다. 생성물·lockfile·배포·문서 전체를 요청 없이 갱신하지 않는다.
- `dist/`·`docs/`를 직접 수정하지 않는다. 전체 빌드는 dist를 정리·재생성하고 문서 명령은 docs를 생성하므로 실행 목적과 변경 범위를 확인한다.
- 브라우저 DOM, Canvas, ResizeObserver, PointerEvent 등을 사용하는 라이브러리다. 전역 등록의 window guard만으로 SSR 전체 지원을 단정하지 않는다.
- PDF 폰트 경로와 `public/assets/OFL.txt`를 보존하고 한글 출력·배포 asset URL 영향을 확인한다. 폰트 fetch는 DB/API 서비스 호출이 아니다.
- HTML 렌더러·사용자 템플릿의 기존 escaping 경계를 확인한다. `html` helper가 입력을 안전하게 변환한다고 가정하지 않는다.
- 파일 존재, 명령과 등록 맵, 호출부를 실제로 확인한다. 오래된 주석·README·로컬 안내 문서보다 현재 구현·설정을 우선 근거로 삼는다.
