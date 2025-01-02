/**
 * 페이징 정보
 */
export interface PagingInfo {
  /**
   * 현재 페이지
   */
  currPage: number;
  /**
   * 페이지 row
   */
  unitPage: number;
  /**
   * 이전 페이지 번호
   */
  prePage: number;
  /**
   * 이전 페이지 있는지 여부
   */
  prePage_is: boolean;
  /**
   * 다음 페이지 번호
   */
  nextPage: number;
  /**
   * 다음 페이지 있는지 여부
   */
  nextPage_is: boolean;
  /**
   * 현재 시작 페이지 번호
   */
  currStartPage: number;
  /**
   * 현재 끝 페이지 번호
   */
  currEndPage: number;
  /**
   * 한페이지에 보여지는 row 수
   */
  countPerPage: number;
  /**
   * 전체 row 수
   */
  totalCount: number;
  /**
   * 전체 페이지 수
   */
  totalPage: number;
}
