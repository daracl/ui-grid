# 검증 기록

## 환경

Windows, PowerShell, Node v24.20.0, TypeScript 5.6.3, Jest 29.7.0, Vite 7.3.7. 실제 브라우저는 설치된 Edge 157.0.4341.46(headless). 버전은 이번 실행 관측값이며 공통 전제 조건이 아니다.

## 결과

| 실행 | 결과 |
| --- | --- |
| `npm.cmd run typecheck` / 최종 `node node_modules/typescript/bin/tsc --noEmit` | 통과 |
| 최초 `npm.cmd test -- --runInBand` | 38 suite, 414 pass, 0 fail |
| 신규 History 최초 재현 | 4건 실패 확인 후 수정; 이후 미저장 표식 목록/트리 2건 추가 실패 확인 후 수정 |
| 신규 identical 재현 | 4개 중 2 fail, 2 pass → 수정 후 4 pass |
| 편집 감사 반영 후 최종 `node node_modules/jest/bin/jest.js --runInBand --json --outputFile=.tmp/audit-jest-final.json` | 41 suite, 446 pass, 0 fail, 0 skip; 70.586초 (빌드 동시 실행) |
| History/DataMutation/RemoteDataController 표적 회귀 | 119 pass |
| `node --test scripts/*.test.cjs scripts/*.test.mjs` | 9 pass, 0 fail |
| 최초 `npm.cmd run build:verify` | 번들 생성 성공, 라이선스 배너 검증 실패(DG-A06) |
| 편집 감사 반영 후 최종 `node scripts/build.mjs --verify` | 전체 선언·ESM/CJS·UMD × dev/prod 빌드와 자산 검증 통과; 30.87초 (Jest 동시 실행) |
| `git diff --check` | 통과 |
| `node scripts/audit-browser.cjs <검증 빌드 폴더>` | 5개 행 규모, 4종 실제 다운로드, pageerror 0 |
| `node scripts/audit-browser.cjs <검증 빌드 폴더> --editing-only` | 최신 압축 UMD를 Edge에서 실행: 조합 키 이벤트, 일반 Enter, textarea 검증/정상 저장, 편집 중 데이터 교체 통과; pageerror 0 |
| `node scripts/audit-artifacts.cjs` | 파일 재열기 구조/값 검사 통과 |
| `node scripts/audit-boundaries.cjs <검증 빌드 폴더>` | ESM/CJS 4형식 로드 및 입력 정책 3건을 assertion으로 검사 |

검증 빌드는 `dist`를 재작성하지 않고 `.tmp/build-<번호>`에 전체 결과를 만든다. 이 폴더가 위 명령의 `<검증 빌드 폴더>`다. audit-boundaries는 최초 감사에서는 결함을 관측하는 도구였으며, 정책 확정 후에는 첫 중복 유지·순환 자손 보존·잘못된 행 제외 결과를 assertion으로 검사하도록 갱신했다.

## 추가 회귀 테스트

`test/integration/AuditHistory.test.ts` 6개: 트리 교체, 자손 추가 Undo/Redo 반복, 진행 중 변경의 Redo 분기, 추가 Undo 체크 정리, hard 삭제 Undo의 미저장 표식(목록/트리).

`test/rule/AuditValidator.test.ts` 4개: identical/different의 동일·다른 값 판정.

`test/integration/RowInputPolicy.test.ts` 17개: 목록/그룹/중첩 트리/flat 트리의 중복 및 잘못된 행 제외, 누락/혼합 ID, 기존 체크·이력 보존, 순환 자손 보존, 교차 연결 순환, 최초 생성, all-invalid 교체, 비배열 입력 사전 거부, 잘못된 children 처리. 최초 감사 이후 추가된 테스트는 총 27개다.

`test/integration/UserInput.test.ts`에 후속 5개 추가: 조합 중 Enter, textarea 필수/최소 길이, 외부 setItems 및 change 콜백 setItems 이후 이력·표시 일관성. 조합/검증 3개와 외부 교체 1개는 수정 전 실패를 확인했다. 감사에서 추가한 테스트는 누적 32개다.

기존 테스트 삭제나 기대값 완화는 하지 않았다. 초기 새 History 테스트의 필드 선택은 aside가 아닌 name 필드를 명시하도록 바로잡았다.

## 내보낸 파일의 실제 검사

모든 파일은 `.tmp/audit-browser/`에 있다. 100개의 한글 행에 쉼표·따옴표·줄바꿈을 포함했다.

- JSON: 다시 파싱해 100행, 첫 문자열과 마지막 숫자 99 확인.
- CSV: UTF-8 BOM, 따옴표 중복 이스케이프, 줄바꿈 포함 필드, 마지막 행 확인. 전체 CSV 역파서는 사용하지 않았다.
- XLSX: ZIP entry 6개 CRC32·중앙 디렉터리·종료 서명, 모든 XML/rels 파싱, sheet 101행(헤더 포함), 한글 특수문자 문자열 확인. Excel 앱에서 열지는 않았다.
- PDF: 5페이지, PDF header/EOF, FontFile2, Flate stream 7개 해제, Unicode CMap 1개 확인. 모든 100행 텍스트 역추출 및 페이지 시각 검증은 미수행.
- light/dark PNG를 직접 열어 기본 표·헤더·스크롤바·한글 표시 확인. 모든 테마/고정열 조합을 확인한 것은 아니다.

## 환경 문제와 미실행의 구분

- Playwright 전용 Chromium 실행 파일 없음: 제품 테스트 실패가 아님. 추가 설치 없이 Edge channel로 대체하여 실제 브라우저 검증 완료.
- Python 실행 명령은 Windows 앱 별칭에서 실행 불가. Poppler/pdfinfo도 PATH에서 찾지 못함. PDF 이미지 렌더링 미완료이며 구조 검사로 대체한 범위를 명시했다.
- ESM/CJS smoke harness 첫 실행의 `Document is not defined`는 Node의 DOM 전역 보완 누락. Document를 제공한 동일 번들은 4개 모두 통과했다. SSR 지원으로 해석하지 않는다.
- Node의 MODULE_TYPELESS_PACKAGE_JSON 경고는 발생했다. 기존 배포 확장자와 package.json type 계약은 변경하지 않았다.
- PowerShell이 npm stderr notice를 NativeCommandError 형태로 로그에 기록한 경우가 있다. 실제 Jest 요약/종료 코드 및 검증 실패 내용을 따로 확인했다.
- npm tarball 독립 설치, 실제 Excel 앱, Firefox/WebKit, OS 클립보드 권한, 모든 수동 HTML 페이지는 미검증.

## 로그

`.tmp/audit-jest-final.json`, `.tmp/audit-jest-final.log`, `.tmp/audit-build.log`, `.tmp/audit-browser/results.json`, `.tmp/audit-browser/editing-results.json`, `.tmp/audit-boundaries.log`. `.tmp`는 Git 제외 경로다. 테스트/진단 스크립트로 재생성할 수 있다.
