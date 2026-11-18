/**
 * html 문자열을 허용 목록(태그 / 속성) 기준으로 정리한 DocumentFragment 를 반환한다.
 *
 * 리포트 JSON 은 외부에서 불러올 수 있으므로 html 컴포넌트는 반드시 이 함수를 거쳐 표시한다.
 * - script / style / iframe / form 등은 내용까지 제거
 * - on* 이벤트 속성, javascript: 등 위험한 url, url() 이 들어간 style 제거
 * - template 으로 파싱하므로 파싱 중에는 스크립트 실행 / 이미지 로드가 일어나지 않는다.
 *
 * @param html html 문자열
 */
export declare function sanitizeHtml(html: string): DocumentFragment;
