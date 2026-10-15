import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { Config } from '@/types/GridConfig';
import { stopPreventCancel } from '@/util/eventUtils';
import { getCellInfo } from '@/util/gridUtils';

/**
 * click event
 * @param cfg config
 * @param contentElement cell element
 * @param context renderer
 */
export const viewRendererClickEvent = (cfg: Config, contentElement: HTMLElement, context: ViewCellRenderer) => {
  if (!context.isClickEnabled()) return;

  cfg.eventManager.on({ el: contentElement, type: 'pointerdown' }, (e: UIEvent) => {
    stopPreventCancel(e);
    const eventElement = e.target as HTMLElement;
    const cellElement = context.getClosestCellElement(eventElement);
    const cellInfo = getCellInfo(cfg, cellElement);

    context.click(e, cellElement, cellInfo);
  });
};
