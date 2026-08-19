import { ScrollDirectionX, ScrollDirectionY } from '@/constants';

export type ScrollMoveOptions = {
  position?: number;
  direction?: ScrollDirectionY | ScrollDirectionX;
  drawFlag?: boolean;
  speed?: number;
  rowIdx?: number;
  colIdx?: number;
};
