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

/** 일반 요약과 그룹 소계·총계에서 공통으로 사용하는 설정. */
export interface SummaryItem extends Partial<Omit<FieldItem, 'name'>> {
  /** 기존 일반 요약의 컬럼명. field가 있으면 field를 우선한다. */
  name?: string;
  /** 집계 결과를 표시할 컬럼명. */
  field?: string;
  /** 함수에는 집계 대상 원본 행 배열을 전달한다. 생략하면 label을 표시한다. */
  expression?: 'sum' | 'avg' | 'count' | 'min' | 'max' | OptionCallback;
  /**
   * 집계 결과 표시 형식. 생략하면 컬럼의 표시 형식을 사용한다.
   */
  displayFormat?: DisplayFormatOptions;
}
