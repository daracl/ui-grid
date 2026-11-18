import { BodyStyle, ThemeType } from '../constantStyles.js';
import { DaraElement } from '../element/DaraElement.js';
import { Config } from '../types/GridConfig.js';
/**
 * 그리드 테마를 적용한다.
 *
 * @param cfg 그리드 설정 (적용된 테마 이름을 보관한다)
 * @param layoutElement `.dg-layout` 요소. 테마 속성은 이 요소의 `.daracl-grid` 루트에 붙인다.
 * @param themeName 변경할 테마 이름. 생략하거나 빈 값이면 그리드별 테마 지정을 해제한다.
 */
export declare function applyGridTheme(cfg: Config, layoutElement: DaraElement, themeName?: ThemeType | ''): void;
/**
 * 본문 스타일(default, striped, borderless, list 등) 클래스를 교체한다.
 *
 * @param layoutElement `.dg-layout` 요소
 * @param styleName 적용할 스타일. 알 수 없는 이름은 무시한다.
 */
export declare function applyBodyStyle(layoutElement: DaraElement, styleName: BodyStyle): void;
