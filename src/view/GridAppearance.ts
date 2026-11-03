import { BODY_STYLE, BodyStyle, GRID_THEME, ThemeType } from '@/constantStyles';
import { DaraElement } from '@/element/DaraElement';
import { Config } from '@t/GridConfig';

/**
 * 그리드 테마를 적용한다.
 *
 * @param cfg 그리드 설정 (적용된 테마 이름을 보관한다)
 * @param layoutElement `.dg-layout` 요소. 테마 속성은 이 요소의 `.daracl-grid` 루트에 붙인다.
 * @param themeName 변경할 테마 이름. 생략하거나 빈 값이면 그리드별 테마 지정을 해제한다.
 */
export function applyGridTheme(cfg: Config, layoutElement: DaraElement, themeName?: ThemeType | ''): void {
  // 지정하지 않은 상태 = 속성을 붙이지 않는다. 속성이 있으면 그리드 안에서는 전역 [data-daracl-theme] 보다 우선하므로
  // 지정하지 않아야 페이지 테마를 따라갈 수 있다.
  const theme: string = themeName ? GRID_THEME[themeName] : '';

  // 알 수 없는 테마 이름은 무시한다.
  if (themeName && !theme) return;

  if (cfg.theme === theme) return;

  cfg.theme = theme;

  // --dui-* 는 .daracl-grid 에서 계산되는 값(--dg-cell-bg-hover 등)이 있으므로 .dg-layout 이 아니라 루트에 지정한다.
  const rootElement = layoutElement.getElement().closest('.daracl-grid');

  if (!rootElement) return;

  if (theme) {
    rootElement.setAttribute('data-daracl-theme', theme);
  } else {
    rootElement.removeAttribute('data-daracl-theme');
  }
}

/**
 * 본문 스타일(default, striped, borderless, list 등) 클래스를 교체한다.
 *
 * @param layoutElement `.dg-layout` 요소
 * @param styleName 적용할 스타일. 알 수 없는 이름은 무시한다.
 */
export function applyBodyStyle(layoutElement: DaraElement, styleName: BodyStyle): void {
  if (!BODY_STYLE[styleName]) return;

  const otherStyles = Object.values(BODY_STYLE)
    .filter((value) => value !== styleName)
    .map((value) => `dg-style-${value}`);

  const newStyle = 'dg-style-' + BODY_STYLE[styleName];

  layoutElement.removeClass(...otherStyles);
  if (!layoutElement.hasClass(newStyle)) {
    layoutElement.addClass(newStyle);
  }
}
