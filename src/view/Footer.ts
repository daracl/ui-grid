import { Config, Selection } from '@t/GridConfig';
import { FooterOptions, PagingParam } from '@t/GridOptions';

import { DaraGrid } from '@/DaraGrid';
import { DaraElement } from '@/element/DaraElement';
import { SelectionInfo } from '@/selection/selection';
import { getPagingInfo } from '@/util/pagingUtil';
import * as utils from '@/util/utils';
import { PagingInfo } from '@t/PagingInfo';
import { GridMain } from './GridMain';

/**
 * Footer class
 *
 * @class Footer
 * @typedef {Footer}
 */
export class Footer {
  private grid: DaraGrid;

  private gridMain: GridMain;

  private footerOpts: FooterOptions;

  private selectionStatusElement: DaraElement;

  private pagingInfoElement: DaraElement;

  private paingElement: DaraElement;

  private footerElement: DaraElement;

  private selectionInfo: SelectionInfo;

  private cfg: Config;

  private isSelectionInfo: boolean;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.footerOpts = grid.getOptions().footer;

    if (!this.footerOpts.enabled) return;

    this.grid = grid;
    this.gridMain = gridMain;
    this.selectionInfo = gridMain.selectionInfo;
    this.cfg = this.grid.config();

    this.isSelectionInfo = !utils.isUndefined(this.footerOpts.selection);

    const footerElement = grid.element().findDaraElement('.dg-footer');
    this.footerElement = footerElement;
    this.selectionStatusElement = footerElement.findDaraElement('.dg-selection-status');

    this.initPaging();
  }

  /**
   * init footer event
   */
  initPaging() {
    if (this.footerOpts.paging?.enabled) {
      this.paingElement = this.footerElement.findDaraElement('.dg-paging');
      this.pagingInfoElement = this.footerElement.findDaraElement('.dg-paging-info');
      this.initPagingEvent();

      this.goPage(this.grid.config().paging.currPage);
    }
  }

  /**
   * init paging event
   */
  initPagingEvent() {
    const pagingCallback = this.footerOpts.paging?.callback;
    const pagingElement = this.paingElement.getElement();
    this.cfg.eventManager.on({ el: pagingElement, type: 'click', selector: '.dg-page-num' }, (e: UIEvent) => {
      const pageNumElement = (e.target as HTMLElement).closest('.dg-page-num');

      const pageNum = utils.intValue(pageNumElement?.getAttribute('pageno') ?? '1');

      if (pagingCallback) {
        pagingCallback(pageNum);
      } else {
        this.goPage(pageNum);
      }

      return true;
    });
  }

  public goPage(pageNum: number) {
    const pagingInfo = this.cfg.paging;
    pagingInfo.currPage = pageNum;
    pagingInfo.totalCount = pagingInfo.totalCount > 0 ? pagingInfo.totalCount : this.cfg.dataInfo.rowLength;

    const pagingViewInfo = this.setPaging(pagingInfo);

    if (pagingViewInfo) {
      const countPerPage = pagingViewInfo?.countPerPage;
      const startIdx = (pagingViewInfo?.currPage - 1) * countPerPage;

      this.cfg.dataManager.setViewItems(this.cfg.dataManager.getOriginItems(), startIdx, startIdx + countPerPage);
      this.gridMain.selectionInfo.setSelectionRangeInfo({} as Selection, true);
      this.gridMain.refreshBody();
      this.gridMain.getScroll().moveVerticalScroll({ rowIdx: 0 });
    }
  }

  /**
   * selection status info
   *
   * @public
   * @param {string} info selection info
   */
  public setSelectionStatus(dataInfo?: any) {
    if (this.isSelectionInfo) {
      const dataInfo = this.selectionInfo.selectionData('json', true);

      if (!utils.isUndefined(dataInfo) && dataInfo?.summary?.count > 1) {
        const selectionFormat = this.footerOpts.selection?.format;
        let statusText = '';
        if (utils.isString(selectionFormat)) {
          dataInfo.summary.enableSummary = dataInfo.summary.numFieldCount > 0;
          statusText = utils.replaceMesasgeFormat(selectionFormat, dataInfo.summary);
        } else if (utils.isFunction(selectionFormat)) {
          statusText = selectionFormat(dataInfo);
        }

        this.selectionStatusElement.text(statusText);
      } else {
        this.selectionStatusElement.text('');
      }
    }
  }

  public setPagingInfo(pagingInfo: PagingInfo) {
    if (this.footerOpts.paging?.enabled) {
      const countPerPage = pagingInfo.countPerPage;

      const start = (pagingInfo.currPage - 1) * countPerPage;

      const statusInfo: any = {
        start: start + 1,
        end: start + countPerPage,
        total: pagingInfo.totalCount,
      };

      statusInfo.end = statusInfo.end > pagingInfo.totalCount ? pagingInfo.totalCount : statusInfo.end;

      if (pagingInfo.totalCount > 0) {
        const statusFormat = this.footerOpts.paging?.format;
        let statusText = '';
        if (utils.isString(statusFormat)) {
          statusText = utils.replaceMesasgeFormat(statusFormat, statusInfo);
        } else if (utils.isFunction(statusFormat)) {
          statusText = statusFormat(statusInfo);
        }

        this.pagingInfoElement.text(statusText);
      } else {
        this.pagingInfoElement.text('');
      }
    }
  }

  /**
   * paging
   *
   * @public
   * @param {PagingParam} info
   * @returns {this}
   */
  public setPaging(info: PagingParam) {
    if (utils.isUndefined(this.footerOpts.paging)) {
      throw new Error('enablePaging not enabled');
    }

    if (info.totalCount < 1) {
      this.setPagingInfo({ totalCount: 0 } as PagingInfo);
      this.paingElement.empty();
      return;
    }

    const pagingInfo = getPagingInfo(info.totalCount ?? 0, info.currPage, info.countPerPage, info.unitPage);

    this.setPagingInfo(pagingInfo);

    this.cfg.paging = pagingInfo;

    let currP = pagingInfo.currPage;
    if (currP == 0) currP = 1;
    const preP_is = pagingInfo.prePage_is;
    const currS = pagingInfo.currStartPage;
    let currE = pagingInfo.currEndPage;
    if (currE == 0) currE = 1;
    const nextO = 1 * currP + 1;
    const preO = currP - 1;
    const strHTML = [];

    strHTML.push('<ul >');

    if (currP <= 1) {
      strHTML.push(' <li class="disabled page-icon"><a href="javascript:">&laquo;</a></li>');
    } else {
      strHTML.push(' <li><a href="javascript:" class="dg-page-num page-icon" pageno="' + preO + '">&laquo;</a></li>');
    }

    if (preP_is && currE - pagingInfo.unitPage >= 0) {
      strHTML.push(' <li class="dg-page-num" pageno="1"><a href="javascript:" >1...</a></li>');
    }

    let no = 0;
    for (no = currS * 1; no <= currE * 1; no++) {
      if (no == currP) {
        strHTML.push(' <li class="active"><a href="javascript:">' + no + '</a></li>');
      } else {
        strHTML.push(' <li class="dg-page-num" pageno="' + no + '"><a href="javascript:" >' + no + '</a></li>');
      }
    }

    if (currS + pagingInfo.unitPage < pagingInfo.totalPage) {
      strHTML.push(
        ' <li class="dg-page-num" pageno="' +
          pagingInfo.totalPage +
          '">...<a href="javascript:" >' +
          pagingInfo.totalPage +
          '</a></li>',
      );
    }

    if (currP == currE) {
      strHTML.push(' <li class="disabled"><a href="javascript:">&raquo;</a></li>');
    } else {
      strHTML.push(' <li><a href="javascript:" class="dg-page-num page-icon" pageno="' + nextO + '">&raquo;</a></li>');
    }

    strHTML.push('</ul>');

    this.paingElement.html(strHTML.join(''));

    return pagingInfo;
  }
}
