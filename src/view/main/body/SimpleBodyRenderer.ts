import { ViewItem } from '@/types/Common';
import { BodyRenderer } from './BodyRenderer';

export class SimpleBodyRenderer extends BodyRenderer {
  public dataDraw(mode?: string): void {
    this.drawData(mode, (_viewItem: ViewItem) => false);
  }
}
