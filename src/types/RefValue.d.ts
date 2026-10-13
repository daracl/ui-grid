export interface RefImgValue {
  label: string;
  link?: string;
  src: string;
  alt?: string;
  target: string;
  value: any;
}

export interface RefOptionValue {
  label?: string;
  link?: string;
  href?: string;
  target?: string;
  disabled?: boolean;
  hide?: boolean;
  value?: any;
}

export interface RefChartValue {
  percent: number;
  label: string;
  value?: any;
}

export type RefValue = string | HTMLElement | RefImgValue | RefChartValue;
