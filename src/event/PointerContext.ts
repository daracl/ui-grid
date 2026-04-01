import { GridMain } from '@/view/GridMain';
import { DaraGrid } from '@/DaraGrid';
import { Body } from '@/view/main/body/Body';

export interface PointerContext {
  grid: DaraGrid;
  gridMain: GridMain;
  body?: Body;
}
