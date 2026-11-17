# 미해결 및 추가 검증

## 확정한 공개 입력 계약

DG-A08(중복 ID), DG-A09(flat 트리 순환), DG-A10(실패한 setItems의 부분 상태 변경)은 사용자 답변을 반영해 수정했다. 실제 재현 결과와 수정은 [REPORT-BUGS.md](REPORT-BUGS.md)에 있다.

사용자가 **문제 행만 제외하고 나머지를 반영**하는 정책을 선택했다. 중복은 첫 행/기존 행 우선, 순환 구성원만 제외, 정상 자손은 유효 상위 행 또는 루트로 보존한다.

List/Tree/Group의 setItems/addItems에 공통 필터를 적용했다. 최초 생성/createItem/appendItems도 같은 경로를 따른다. 숫자/문자열 ID 구별, 반복 객체, 잘못된 행, 순환·자손 보존, Undo/Redo를 회귀 테스트로 확인한다. throwing getter·Proxy·동결 객체와 극단적 깊이의 렌더링은 별도 검증 범위다.

## 아직 완료하지 않은 감사 범위

1. 전체 src 186파일, 전체 테스트와 수동 예제의 모든 줄에 대한 심층 검토. 이번에는 파일 목록과 주요 흐름, 위험 경계 및 실행 테스트를 중심으로 검사했다.
2. 모든 renderer의 null/누락 옵션/사용자 refValue/custom 확장 조합과 실제 브라우저 Enter/Escape/Tab/IME 검증. 등록 맵에 없는 `time`은 text fallback 경로이며, 파일 존재만으로 지원 타입으로 보지 않는다. checkbox는 interaction edit renderer 경로다.
3. 고정 좌/우 열·다단 헤더·rowSpan·그룹·검색·페이징·리사이즈·줌을 조합한 실제 브라우저 회귀. 기존 jsdom 테스트가 모두 통과했다고 시각 검증을 대체하지 않는다.
4. 편집 중 setItems는 외부 호출과 change 콜백 경로를 검증하고 DG-A13을 수정했다. 행 삭제/필드 변경, 외부 객체 직접 변이, nested History 호출 등 전체 상태 전이는 남아 있다.
5. PDF 전 페이지 이미지 렌더링과 한글 100행 텍스트 역추출, Excel 앱에서 XLSX 열기, 다량 PDF/XLSX 내보내기.
6. tarball을 깨끗한 소비자에 설치한 패키지 검증. 현재 local core 버전 0.0.13은 선언/lockfile 0.0.14와 다르므로 별도 설치 환경 검증이 중요하다. 기존 링크나 의존성은 자동 교체하지 않았다.
7. 연속 스크롤 FPS, 대량 복사/붙여넣기, 장시간 destroy 반복과 강제 GC/heap snapshot. 단순 DOM 자식 0개는 누수 부재 증명이 아니다.
8. DOM 삽입 경로 전체의 end-to-end taint 분석, 외부 core sanitizer 자체 전수 검사, 의존성 취약점 조회. 기존 sanitize/regex 테스트 통과 범위만 확인했다.
9. Firefox/WebKit, 모바일 포인터, OS 클립보드, 접근성, 모든 uitest 수동 페이지.

## 실행 환경상 제한

PDF 시각 검증 도구(Python/Poppler)가 사용 가능하지 않았다. Playwright 전용 Chromium 부재는 설치된 Edge로 해결했다. 타입 검사/Jest/빌드/Edge 실행은 실제 수행했으며 미실행 검증을 성공으로 보고하지 않았다.

## 완료 판정

확인한 13건 수정과 입력 정책 반영, 회귀 테스트, 실제 브라우저 기본 성능·내보내기, 보고서 5종 작성을 수행했다. 입력 정책 확인 대기는 해소됐다. 후속 편집 회귀는 DOM 이벤트 기반이며 실제 OS IME 검증을 대신하지 않는다. 다만 위 심층 감사·시각 검증 범위가 남아 있어, 요청된 **전체 코드 감사 완료**로 판정하지 않는다.
