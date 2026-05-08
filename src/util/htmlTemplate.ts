/**
 * tagged template html helper
 * html 템플릿 문자열 minify 처리 하기위한 helper 함수
 *
 * @public
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((result, str, i) => {
    const value = values[i];

    return result + str + (value == null ? '' : String(value));
  }, '');
}
