import { GridMain } from '@/view/GridMain';
import { DaraGrid } from '@/DaraGrid';
import { Body } from '@/view/main/body/Body';
import { Header } from '../view/main/header/Header';

export interface PointerContext {
  grid: DaraGrid;
  gridMain: GridMain;
  body?: Body;
  header?: Header;
}
