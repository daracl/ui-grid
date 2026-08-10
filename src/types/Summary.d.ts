import { VerticalPosition } from '@/constants';
import { DisplayFormatOptions, OptionCallback } from './Common';
import { FieldItem } from './GridField';

export interface SummaryOptions {
  /**
   * header 높이
   * @type number |number[]
   */
  height: number | number[];

  position: VerticalPosition;

  items: SummaryItem[][];
}

export interface SummaryItem extends FieldItem {
  /**
   * sum, avg 연산
   */
  expression: string | OptionCallback;
  /**
   *display format
   */
  displayFormat?: DisplayFormatOptions;
}
