# 확인된 결함

위치는 수정 후 파일 기준이다. 단순 개선 제안은 이 목록의 결함 수에 넣지 않았다.

## DG-A01 — 트리 교체 후 이전 행이 조회됨 (High, 수정)

- 위치: `src/service/TreeDataManager.ts:83`, `setItems`.
- 원인: List와 달리 Tree 교체 시 rowMap을 비우지 않음.
- 재현: id=p를 로드한 뒤 `setItems([{id:'new',name:'new'}])`, `getItemById('p')`.
- 실제: 이전 p 객체 반환. 기대: undefined. 표시 목록과 ID 조회가 불일치하고 이전 데이터 참조가 남음.
- 수정: 새 트리 변환 전에 rowMap 초기화.
- 검증: `AuditHistory.test.ts`의 교체 테스트, 전체 424개 통과. 잘못된 입력에 대한 원자성은 DG-A10 별도 문제다.

## DG-A02 — 트리 추가가 Undo/Redo에 기록되지 않음 (High, 수정)

- 위치: `src/service/TreeDataManager.ts:126`, `:678`.
- 원인: `addItems`가 addHistory를 호출하지 않으며 복원 경로도 remove 이력만 처리.
- 재현: p 아래 c와 c의 자손 leaf를 createItem으로 추가. undo 이력 개수가 0.
- 실제: 추가 취소 불가. 기대: 한 번의 Undo로 자손 포함 제거, Redo로 같은 부모/형제 위치 복원.
- 수정: 자손 전체를 단일 이력으로 기록하고 view 메타데이터/형제 위치를 저장, Redo 시 부모부터 연결.
- 검증: 반복 Undo/Redo 2회, 표시 순서·자손 조회·서버 미저장 상태 확인. 기존 트리 부모 ID/삭제/원격 테스트도 통과.

## DG-A03 — 새 batch 변경 중 이전 Redo가 현재 값을 덮어씀 (High, 수정)

- 위치: `src/service/HistoryManager.ts:195`.
- 원인: batch 중에는 commit 시점까지 redoStack을 유지.
- 재현: 이름 변경 → Undo → beginHistory → 다른 이름으로 변경 → Redo.
- 실제: 이전 변경을 다시 적용할 수 있음. 기대: 새 변경 분기가 시작됐으므로 Redo 불가.
- 수정: currentEntry에 실제 변경을 추가하는 순간 redoStack 초기화. 빈 begin/rollback은 이전 Redo를 지우지 않음.
- 검증: Redo=false, 현재 새 값 유지, commit 후 Undo가 원래 값으로 복원됨.

## DG-A04 — 추가 행 Undo 후 체크 ID 잔존 (Medium, 수정)

- 위치: `src/service/DataManager.ts:1187`.
- 원인: 추가 Undo가 rowMap만 직접 제거하고 체크 등 연관 상태는 남김.
- 재현: createItem(new) → new 체크 → Undo → getCheckedCount.
- 실제: 행이 없는데 1. 기대: 0.
- 수정: 공통 deleteRowItem 사용. Redo에 필요한 신규 표식은 이력에서 복원.
- 검증: 신규 회귀 테스트 및 전체 선택/체크 관련 테스트 통과.

## DG-A05 — identical 유효성 검사 역전 (Medium, 수정)

- 위치: `src/rule/validator.ts:54`.
- 원인: different와 같은 `==` 조건으로 실패를 반환.
- 재현: 다른 필드 값 'same'에 대해 identical 설정 후 'same' / 'other' 검증.
- 실제: 같은 값 거부, 다른 값 허용. 기대: 반대.
- 수정: identical만 `!=`로 변경. 기존 느슨한 값 비교 계약은 유지.
- 검증: identical/different × 일치/불일치 4개 테스트. 수정 전 identical 2개 실패, 수정 후 전체 통과.

## DG-A06 — 배포 라이선스 배너 누락 (Medium, 수정)

- 위치: `vite.common.mjs:36`.
- 원인: Rollup output.banner 설정 이후 Vite/esbuild 기본 legalComments=none 변환에서 주석 제거.
- 재현: `npm.cmd run build:verify`. 번들 생성은 성공하지만 UMD `/Licensed MIT/` 검사 실패.
- 기대: 배포 번들 배너 보존 및 기존 검증 통과.
- 수정: 공통 esbuild 설정에 legalComments=inline 추가.
- 검증: 최종 전체 검증 빌드 27.99초, 압축/비압축 UMD 생성·로드·배너 검사 통과. 기존 테스트를 완화하지 않았다.

## DG-A07 — 삭제 Undo가 미저장 신규 행 표식을 잃음 (High, 수정)

- 위치: `src/service/DataManager.ts:1217`, `:1234`, `:1195`.
- 원인: hard 삭제가 createdRowIds를 제거하지만 삭제 이력에는 해당 정보가 없음.
- 재현: createItem(new) → hard removeItems(new) → Undo → getRowSnapshots(new).localOnly.
- 실제: false. 기대: 서버에 저장된 적 없으므로 true. 원격 삭제/저장 대상 판별에 영향.
- 수정: 추가/삭제 이력에 선택적 localOnly 저장·복원. 추가 Undo에서도 공통 정리 경로 사용.
- 검증: 목록·트리 2개 회귀와 RemoteDataController 92개 통과.

## DG-A08 — 중복 ID가 앞 행 데이터를 덮어씀 (High, 수정)

- 위치: `src/service/ListDataManager.ts:32`, `src/service/DataManager.ts:948`.
- 원인: ViewItem은 각각 생성하지만 rowMap은 동일 키의 마지막 객체만 보관.
- 재현: `setItems([{id:1,name:'first'},{id:1,name:'last'}])` (rowIdField=id).
- 실제: getItems 이름이 `['last','last']`. first 데이터 유실.
- 확정 정책: 첫 행 유지, 추가 시 기존 행 우선. 숫자 0과 문자열 '0'은 별개 ID. ID 누락은 자동 생성, 반복 객체는 한 번만 반영.
- 수정: `src/util/rowInputUtils.ts`의 filterInputRows와 DataManager 공통 진입 경로에서 중복/잘못된 행을 제외.
- 검증: RowInputPolicy의 목록·그룹·중첩/flat 트리 교체 및 추가 테스트. audit-boundaries의 duplicate 기대값은 `['first']`로 갱신.

## DG-A09 — flat 트리 순환이 오류 없이 전부 누락됨 (High, 수정)

- 위치: `src/service/TreeDataManager.ts:206`, buildTree.
- 원인: 부모 연결만 수행하고 cycle 검사가 없어 루트 없는 컴포넌트가 변환 대상에서 빠짐.
- 재현: `isFlatData:true`, a.pid=b, b.pid=a 두 행을 setItems.
- 실제: getAllItems()=[]이고 예외 없음. 기대: 명시적 잘못된 입력 처리, 조용한 손실 방지.
- 확정 정책: 순환 구성원만 제외. 정상 자손은 유효한 상위 행에 연결하고 없으면 루트로 보존.
- 수정: rowInputUtils의 excludeParentCycles 및 중첩 객체 그래프의 강결합 요소 검사. 순환 검사는 재귀 호출 없이 수행한다.
- 검증: 자기 순환·상호 순환·교차 연결 순환, 정상 자손 보존, 최초 생성과 추가/Undo/Redo 테스트. 모든 입력이 순환이면 빈 결과가 정상이며, 정상 자손이 있으면 반드시 남는다.

## DG-A10 — 잘못된 행 교체 실패가 기존 상태를 손상 (High, 수정)

- 위치: `src/service/ListDataManager.ts:32`, `src/service/DataManager.ts:683`.
- 원인: 행 배열 사전 검증 전에 rowMap을 비우고 새 행을 순차 초기화.
- 재현: good 행 로드 → `setItems([{id:'new',name:'new'},null])`.
- 실제: TypeError 발생 후 getItemById(good)가 undefined. old ViewItem과 새로운 부분 rowMap이 불일치할 수 있음.
- 확정 정책: 배열 내 잘못된 행만 제외하고 나머지로 정상 교체. 예시 입력에서는 new만 남고 good은 정상 교체로 제거된다.
- 수정: rowMap 변경 전에 행 필터링. setItems 배열 자체가 잘못되면 변경 전에 TypeError. 모두 제외된 교체는 빈 목록, 모두 제외된 추가는 no-op.
- 검증: null·undefined·숫자·배열 행 혼합, 잘못된 children, 비배열 setItems의 기존 데이터 보존 및 모든 행 제외 테스트.

## DG-A11 — IME 조합 Enter가 편집을 조기 확정 (Medium, 수정)

- 위치: `src/renderer/edit/TextAbstractRenderer.ts`, initEvt.
- 재현: text 편집기의 값을 '한'으로 바꾸고 isComposing=true인 Enter 이벤트 전송.
- 실제: 조합이 끝나기 전에 행 값이 '한'으로 저장됨. 기대: 조합 중에는 편집 유지.
- 수정: 조합 중 keydown은 확정/취소 처리하지 않는다.
- 검증: 수정 전 실패 확인. 조합 Enter 이후 기존 값 유지, 일반 Enter 이후 완성 문자열 저장을 검사한다. 실제 OS IME 입력은 별도 미검증이다.

## DG-A12 — textarea가 문자열 검증을 우회 (High, 수정)

- 위치: `src/renderer/edit/TextAreaRenderer.ts`, valid.
- 재현: required=true, minLength=2인 textarea에 빈 값 또는 한 글자를 입력하고 blur.
- 실제: 두 값 모두 저장됨. 기대: 기존 값 유지 및 검증 실패 표시.
- 수정: 항상 true를 반환하는 override를 제거하고 TextAbstractRenderer의 공통 문자열 검증을 상속한다.
- 검증: 두 사례 모두 수정 전 실패 확인. 수정 후 잘못된 값 거부와 정상 여러 줄 값 저장을 검사한다.

## DG-A13 — 교체된 행의 편집이 새 데이터의 Undo 이력을 오염 (High, 수정)

- 위치: `src/renderer/EditCellRenderer.ts`, setValue; `src/renderer/edit/TextAbstractRenderer.ts`, setChangeValue.
- 재현: 행 편집 시작 → 같은 ID의 다른 객체로 setItems → 이전 편집기에서 Enter.
- 실제: 제거된 객체의 변경이 새 데이터의 Undo 이력에 추가됨. 같은 ID로 Undo를 적용하면 새 행에 이전 값이 덮일 수 있음.
- 수정: 편집 시작 대상과 현재 rowMap 객체의 동일성을 검증 전과 change 콜백 후 확인한다. 제거된 대상의 편집은 종료하고 이전 셀 정보를 다시 렌더링하지 않는다.
- 검증: 교체 이후 이력 없음 검사가 수정 전 실패. 외부 setItems와 change 콜백 안의 setItems 두 경로에서 새 값·이력·표시 내용을 검사한다.

## 후속 입력 정책

사용자 답변 “문제 행만 제외하고 나머지를 반영”에 따라 DG-A08~10을 수정했다. 위 원인/실제 동작은 수정 전 재현 기록이다. 필터 구현 추가로 기존 줄 번호가 이동할 수 있으므로 메소드명과 신규 유틸리티를 함께 참조한다. Proxy/getter 예외나 쓰기 불가능한 객체까지 정상 행으로 지원하는 정책을 추가한 것은 아니다.
