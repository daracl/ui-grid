import { GridMain } from "@/view/GridMain";
import { PointerSession } from "./PointerSession";
import { DaraGrid } from "@/DaraGrid";

export interface PointerContext {
  grid: DaraGrid;
  gridMain: GridMain;
}
