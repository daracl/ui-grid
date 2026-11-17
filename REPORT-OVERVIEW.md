# DaraGrid 코드 감사 현황

감사일: 2026-11-12 (Asia/Seoul). 대상: `@daracl/grid` 0.0.37, 시작 브랜치 `main`, 시작 작업 트리 깨끗함.

## 결론과 완료 범위

재현한 결함 13건을 수정했다. 사용자가 선택한 “문제 행만 제외하고 나머지 반영” 정책을 적용했고, 후속 편집 감사에서 IME 조기 확정·textarea 검증 우회·교체된 행의 편집 이력 오염도 수정했다. 상세 검증 결과는 REPORT-TESTS.md에 기록한다.

**이 보고서는 전수 감사 완료 선언이 아니다.** 파일 목록 전체와 주요 실행 경로를 확인했지만, 전체 소스·테스트·수동 예제의 모든 줄 정독, 모든 renderer의 모든 입력 조합, 모든 UI 조합, 장시간 메모리 누수 검증까지 완료하지 않았다. 사용자가 제시한 최종 완료 기준은 아직 충족하지 않았다. 미검증을 통과로 집계하지 않았다.

| 심각도 | 확인 | 수정 | 미해결 |
| --- | ---: | ---: | ---: |
| Critical | 0 | 0 | 0 |
| High | 9 | 9 | 0 |
| Medium | 4 | 4 | 0 |
| Low | 0 | 0 | 0 |

확인한 Critical 0건은 Critical 결함 부재를 보증하지 않는다. 상세 재현·수정 위치는 [REPORT-BUGS.md](REPORT-BUGS.md)에 있다.

## 구조와 실제 설정

- `src` 187파일, `test` 43파일(감사 테스트 추가 후), `uitest` 149파일, `style` 44파일. 단일 패키지이며 dist/docs는 생성물이다.
- `DaraGrid` 공개 API → `GridMain` 옵션/뷰/수명 관리 → List/Tree/Group DataManager → Body/Header/Scroll/Selection 및 renderer 구조다.
- HistoryManager는 변경 기록만 관리한다. DataManager가 실제 Undo/Redo를 적용한다. `rollbackHistory`는 데이터 복구가 아니다.
- 내보내기는 `src/export/{pdf,excel,csv,json}`에 구현되어 있고 동적 모듈 로딩을 사용한다. Excel은 자체 ZIP/XML 생성기다.
- `service/remote`는 브라우저에서 HTTP 요청을 조정한다. 저장소 자체가 서버 애플리케이션인 것은 아니다.
- 현재 설정은 Vite `.mjs`, `moduleResolution: bundler`, TypeScript 5.6.3이다. AGENTS.md 일부 버전·파일 경로 설명보다 현재 소스를 우선했다.
- Node v24.20.0, Jest 29.7.0, Vite 7.3.7로 실행했다. 선언된 core 범위/lockfile은 0.0.14 계열이나 로컬 연결 패키지 관측 버전은 0.0.13이다. 이 결과를 깨끗한 npm 설치 환경의 결과로 일반화할 수 없다.

## 영역별 증거와 한계

| 영역 | 수행한 검사 | 남은 범위 |
| --- | --- | --- |
| A 인스턴스/수명 | GridMain 생성·destroy 추적, ZeroIdAndHost/DestroyCleanup/EventManager 테스트 | 생성 중 예외 정리 전수, 장시간 반복/heap retaining path |
| B 데이터 | List/Tree/Group 변경 경로, ID 0/문자열 ID, 문제 행 제외 정책 및 회귀 | throwing getter·읽기 전용 객체 등 특수 입력 |
| C 검색/정렬/페이징 | DataMutation/IncrementalSort/searchUtils, 실제 10만 행 검색·정렬 | 모든 혼합 타입/사용자 콜백 조합 |
| D 트리 | 부모 0, 삭제 복원, 추가 Undo/Redo, 교체 후 조회, 순환 제외·정상 자손 보존 | 극단적 깊이의 후속 렌더링 |
| E 그룹/합계/RowSpan | 그룹·요약 계산/렌더링 경로 및 기존 그룹·Excel 병합 테스트 | 대량 다층 그룹과 고정열/RowSpan 실제 브라우저 조합 |
| F 편집/검증 | UserInput 34개, 동일값 검증 역전 수정, validator/renderer 계약 추적 | 모든 renderer의 실제 키보드/IME/포커스 조합 |
| G History | 신규 6개, DataMutation 21개, 원격 연동 92개와 전체 회귀 | 모든 중첩 batch·외부 객체 직접 변이 조합 |
| H 선택 | CellDragSelection/GroupSelection/UserInput 기존 테스트 | OS별 키보드·클립보드와 모든 선택 모드 교차 조합 |
| I DOM/이벤트 | 이벤트 제거·예약 취소 경로, 기존 destroy 테스트, 실제 destroy 후 자식 0 | 정밀 누수 프로파일, 모든 포인터 취소 경로 |
| J 헤더/고정열 | Builder 30개, ResizeHandler/FieldWidthCalculator 추적 | 실브라우저 모든 고정열 경계·줌·리사이즈 |
| K renderer | 등록 맵/Factory/index 연결 확인, 기존 renderer 테스트 | 모든 구현 전수 심층 검토, custom 확장 계약 |
| L 내보내기 | 네 형식 실제 다운로드와 재열기 구조 검사, 기존 변환 테스트 | PDF 시각 검증, 실제 Excel 앱 호환성, 대용량 내보내기 |
| M UI/테마 | light/dark 스크린샷 직접 확인 | 모든 수동 페이지·반응형·메뉴/tooltip 겹침 |
| N 보안 | DOM 삽입 지점 검색, HTML/URL 경계 추적, XSS 12개·regexGuard 30개 | core sanitizer 전수 감사, 전체 데이터 흐름 증명, 공급망 검사 |
| O 성능 | 100/1천/1만/5만/10만 행 Edge 실측 | 반복 통계·복잡한 renderer·장시간 메모리/클립보드 |
| P 배포 | 전체 번들·선언·자산 검증, ESM/CJS 4개 및 UMD 2개 로드 | tarball을 독립 소비자에 설치하는 검증 |

## 변경 파일

- `src/service/HistoryManager.ts`: 새 변경 시 Redo 분기 폐기, 추가/삭제 복원용 선택적 메타데이터.
- `src/service/DataManager.ts`: 추가 Undo의 상태 정리, 미저장 신규 행 표식 복원.
- `src/service/TreeDataManager.ts`: 교체 시 이전 rowMap 제거, 자손 추가 이력과 트리 복원.
- `src/util/rowInputUtils.ts`, `src/service/ListDataManager.ts`: 공통 입력 필터와 트리 순환 검사. `test/integration/RowInputPolicy.test.ts` 및 README에 정책과 회귀 추가.
- `src/rule/validator.ts`: identical 조건 수정.
- `vite.common.mjs`: esbuild의 라이선스 주석 제거 방지.
- `test/integration/AuditHistory.test.ts`, `test/rule/AuditValidator.test.ts`: 신규 회귀 10개.
- `scripts/audit-browser.cjs`, `scripts/audit-artifacts.cjs`, `scripts/audit-boundaries.cjs`: 재현·실측 도구.
- 루트 REPORT 5종. dist/docs/lockfile/사용자 전역 설정은 변경하지 않았다.

검증 상세: [REPORT-TESTS.md](REPORT-TESTS.md). 성능: [REPORT-PERFORMANCE.md](REPORT-PERFORMANCE.md). 남은 작업: [REPORT-REMAINING.md](REPORT-REMAINING.md).
