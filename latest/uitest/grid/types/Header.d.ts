import { FieldItem } from './GridField';

/**
 * field 정렬
 */
export type FieldSortInfo = {
  name: string;
  field: FieldItem;
  isValue?: boolean;
  ascOrder: boolean;
  sortCell: number;
};
