import { ALL_SELECT_VALUE, SearchDirection, SearchDirectionMap } from '@/constants';
import { SearchMode } from '@/types/Common';
import { getLayerElement, hasClass, innerLayerPosition } from '@/util/domUtils';
import { isEnter, isEsc, stopPreventCancel } from '@/util/eventUtils';
import { html } from '@/util/htmlTemplate';
import { toggleClass } from '@/util/styleUtils';
import { merge } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { DataSearch } from './DataSearch';

/**
 * api search class
 *
 * @class ApiDataSearch
 * @typedef {DataSearch}
 */
export class ApiDataSearch extends DataSearch {
  constructor(gridMain: GridMain) {
    super(gridMain);
  }

  openSearch() {
    return true;
  }

  public search(searchText: string, opts: SearchMode) {
    const cfg = this.gridMain.config();

    const options = merge({}, this.defaultSearchOpts, opts);

    if (options.searchFields == ALL_SELECT_VALUE) {
      options.searchFields = this.allFieldNames;
    }

    if (searchText == '') {
      cfg.searchEnable = false;
      this.setMatchCountText(true);
      this.gridMain.getBody().clearSearchHighlight();
    } else {
      cfg.searchEnable = true;
    }

    cfg.dataManager.search(searchText, options);

    this.gridMain.refreshBody(true, 'search');

    const searchMatchInfo = this.cfg.searchMatchInfo;

    return { count: searchMatchInfo.matchCount, matchIndex: searchMatchInfo.currentMatchIndex };
  }

  setMatchCountText(clear = false) {
    return;
  }
}
