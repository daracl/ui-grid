import { HorizontalRegion } from '@/constants';

export interface BodyMatchInfo {
  searchEnabled: boolean;
  cellIndex: number;
  matchViewItem: ViewItem | undefined;
  searchMatchedFields: string[] | undefined;
}

export interface BodyFieldGroup {
  name: HorizontalRegion;
  fields: FieldItem[];
  element: DaraElement;
  startCol: number;
}

/**
 * Body Field Template 정보
 */
interface BodyFieldTemplateInfo {
  /** Column Index */
  col: number;

  /** Cell Class */
  cellClassName: string;

  /** Renderer Class */
  rendererClassName: string;

  /** Renderer Style */
  rendererStyle: string;
}
