# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 응답 언어

- 모든 사용자 응답은 반드시 한국어로 작성한다.
- 사용자가 영어로 질문하더라도 기본적으로 한국어로 답변한다.
- 코드, 변수명, 함수명, 클래스명, API 명칭 등 기술적인 고유명사는 원문을 유지한다.
- 코드 주석도 특별한 요청이 없는 한 한국어로 작성한다.
- 영어 문서나 에러 메시지를 설명할 때는 원문을 유지하되 설명은 한국어로 작성한다.
- 사용자가 특정 언어로 답변해 달라고 명시적으로 요청한 경우에만 해당 언어를 사용한다.

## 답변 스타일

- 간결하고 명확하게 답변한다.
- 불필요하게 장황한 설명은 피한다.
- 개발 관련 질문에서는 가능한 경우 예제 코드와 함께 설명한다.

## 빌드 및 테스트 명령어

- `yarn dev` : vite 개발 서버 실행(포트 5178). 브라우저에서 `/uitest/index.html`이 자동으로 열리며, 각 기능별 수동/시각 테스트 페이지(`uitest/*.html`)를 직접 열어 확인할 수 있다.
- `yarn build` : 배포용 전체 빌드. `build:escjs`(ESM/CJS, `vite.config.js`) → `build:umd`(UMD, `vite.config.umd.js`) → `mergenclean`(`.d.ts` 복사, `tsc --emitDeclarationOnly`로 타입 생성, `dist/unmin` 정리, html 복사) 순으로 실행된다.
- `yarn test` : Jest 유닛 테스트 전체 실행(`test/**/*.test.ts`). 단일 파일만 실행하려면 `yarn test test/format/formatNumber.test.ts`, 특정 테스트명만 실행하려면 `yarn test -t "이름"`.
- `yarn pwtest` : Playwright 테스트 실행. 저장소에 `playwright.config`나 `*.spec.ts` 파일이 없으므로, 사용 전 설정 여부를 먼저 확인할 것.
- `yarn docs:gen` : typedoc으로 `docs/` API 문서 재생성(`docs/` 하위 파일은 직접 수정하지 않는다).

코드 스타일은 `.prettierrc`(세미콜론 필수, single quote, printWidth 120, trailing comma all)와 `.eslintrc.json`(`eslint:recommended` + `@typescript-eslint/recommended`)을 따른다. import는 절대 경로 별칭 `@/`(→`src/`), `@t/`(→`src/types/`)를 사용한다.

## 아키텍처

프레임워크 의존성 없는 순수 TypeScript 데이터 그리드 라이브러리(`@daracl/grid`)이다. 진입점은 `src/index.ts`(ESM/CJS, `DaraGrid` export + `style/daracl.grid.scss` 포함)와 `src/index.umd.ts`(UMD, `window.Daracl.grid`로 전역 등록) 두 가지다.

- **인스턴스 구조**: `DaraGrid`(`src/DaraGrid.ts`)는 공개 API만 노출하는 퍼사드이며, 실제 동작은 대부분 `GridMain`(`src/view/GridMain.ts`)에 위임한다. `GridMain`은 옵션 초기화, DOM 골격 생성, 하위 뷰 컴포넌트(Header/Body/Footer/Toolbar/Scroll/Summary/ContextMenu) 조립을 담당하는 핵심 컨트롤러다. 생성된 모든 인스턴스는 `GridMain` 내부 `ALL_INSTANCE` Map에 `$instanceId`로 등록되고, `DaraGrid.instance(element)`로 다시 조회할 수 있다.
- **DOM/필드 빌드**: `src/view/builder/`의 `StructureBuilder`가 헤더·바디 컬럼 DOM 구조를 만들고, `FieldBuilder`/`FieldWidthCalculator`/`DimensionCalculator`가 필드 크기를 계산한다. `RendererFactory`는 field의 `renderer`/`editRenderer` 옵션 타입 문자열을 보고 실제 렌더러 인스턴스를 생성한다.
- **렌더러 시스템**: `src/renderer/`의 `CellRenderer`(뷰 렌더링), `EditCellRenderer`(편집 렌더링), `SummaryRenderer`, `ToolBarRenderer` 추상 클래스를 기반으로, `view/`·`edit/`·`toolbar/`·`summary/` 하위 디렉터리에 타입별 구현체가 있다. 각 구현체는 `constantRenders.ts`의 `VIEW_RENDERER`/`EDIT_RENDERER`/`ASIDE_RENDERER` 맵에 `type` 키로 등록되어 있다. 새 렌더 타입을 추가할 때는 해당 디렉터리에 클래스를 만들고 이 맵에 등록해야 `RendererFactory`가 인식한다.
- **데이터 계층**: `src/service/DataManager`(abstract)를 `ListDataManager`(목록형)와 `TreeDataManager`(트리형)가 상속한다. 정렬, 검색, row 상태(추가/수정/삭제/soft-delete), 체크/선택 상태를 관리하며, `HistoryManager`가 undo/redo 히스토리를 담당한다.
- **이벤트 시스템**: `src/event/EventManager`는 WeakMap 기반으로 엘리먼트별 리스너를 관리하고 `selector` 옵션으로 이벤트 위임을 지원하는 자체 구현체다(외부 라이브러리 미사용). `PointerContext`/`PointerHandler`/`PointerSession`은 포인터 기반 드래그 동작(컬럼 리사이즈, 행 이동, 셀 드래그 선택 등)의 상태 머신을 구성한다.
- **선택/검증**: `src/selection/selection.ts`가 셀·행 선택 상태와 선택 영역을 계산하고, `src/rule/`(`validator.ts` + `numberValidator`/`stringValidator`/`regexpValidator`)이 값 유효성 검증을 담당한다.
- **옵션과 기본값**: 공개 옵션·타입은 `src/types/*.d.ts`(`GridOptions`, `GridConfig`, `GridField` 등)에 정의되어 있고, 실제 기본값 병합은 `defaultGridOption.ts`/`defaultGridConfig.ts`가 수행한다. 옵션 타입을 바꾸면 이 두 파일의 기본값도 함께 갱신해야 한다.
- **대용량 처리**: `src/worker/itemWorker.ts`는 대량 데이터 처리를 위한 Web Worker다.
- **수동/시각 테스트 관례**: 새 기능을 추가하면 `uitest/*.html`에 대응하는 데모 페이지를 함께 추가하는 것이 이 저장소의 관례다(예: `edit.html`, `tree.html`, `selection.html` 등 기능별 1파일).
