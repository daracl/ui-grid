import { Config } from '@t/GridConfig';

import { SearchMode } from '@/types/Common';
import { GridMain } from '@/view/GridMain';
import { SearchOptions } from '@t/GridOptions';
import { merge } from '@/util/utils';
import { ALL_SELECT_VALUE, MATCH_WHOLE_REGEX, SearchDirectionMap } from '@/constants';

/**
 * DataSearch class
 *
 * @class DataSearch
 * @typedef {DataSearch}
 */
export abstract class DataSearch {
  protected readonly gridMain: GridMain;

  protected readonly cfg: Config;

  protected readonly searchOpts: SearchOptions;

  protected readonly allFieldNames: string[] = [];

  protected readonly defaultSearchOpts: SearchOptions;

  protected readonly matchWholeRegex?: RegExp;

  constructor(gridMain: GridMain) {
    this.cfg = gridMain.config();
    this.searchOpts = gridMain.options().search;
    this.gridMain = gridMain;
    const searchOpts = this.searchOpts;

    const allFieldNames = [];
    for (const field of this.cfg.currentFields) {
      allFieldNames.push(field.name);
    }

    this.allFieldNames = allFieldNames;

    this.defaultSearchOpts = merge(
      {
        matchCase: false,
        matchWholeWord: false,
        useRegex: false,
        searchFields: ALL_SELECT_VALUE,
        matchWholeRegex: MATCH_WHOLE_REGEX,
        hideNonMatched: false,
        direction: SearchDirectionMap.NEXT,
      },
      {
        matchWholeRegex: searchOpts.matchWholeRegex ?? false,
        hideNonMatched: searchOpts.hideNonMatched ?? false,
      },
    );
  }

  public abstract openSearch(): boolean;

  public abstract search(searchText: string, opts: SearchMode): boolean;

  public abstract setMatchCountText(): void;
}
