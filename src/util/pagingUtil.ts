import { PagingParam } from '@/types/GridOptions';
import { PagingInfo } from '@t/PagingInfo';

/**
 *  페이징 파라미터를 페이징 정보로 변환
 * @param pagingParam 페이징 파라미터
 * @param rowLength 전체 row 수
 * @returns
 */
export const getPagingParamToPagingInfo = (pagingParam: PagingParam, rowLength: number): PagingInfo => {
  const page = pagingParam?.page || 1;
  const totalCount = pagingParam?.totalCount ?? rowLength;
  const pageSize = pagingParam?.pageSize || 10;
  const unitPage = pagingParam?.unitPage || 10;

  return getPagingInfo(totalCount > 0 ? totalCount : rowLength, page, pageSize, unitPage);
};

/**
 * 페이징 정보 얻기
 ;*
 * @param {number} totalCount 전체 row 수
 * @param {number} page  현재 페이지 number
 * @param {number} pageSize 한페이지에 보여질 row 수
 * @param {number} unitPage 한페이지에 보여질 페이지 수
 * @returns {PagingInfo} 페이징 정보
 */
export const getPagingInfo = (totalCount: number, page: number, pageSize: number, unitPage: number): PagingInfo => {
  pageSize = pageSize || 10;
  unitPage = unitPage || 10;

  if (totalCount < 1) {
    return {
      page: 0,
      unitPage: 0,
      totalCount: 0,
      totalPages: 0,
    } as PagingInfo;
  }

  if (totalCount < pageSize) {
    pageSize = totalCount;
  }

  const totalPages = totalCount % pageSize == 0 ? totalCount / pageSize : Math.floor(totalCount / pageSize) + 1;

  if (totalPages < page) {
    page = totalPages;
  }

  let currStartPage;
  let currEndPage;

  if (totalPages <= unitPage) {
    currEndPage = totalPages;
    currStartPage = 1;
  } else {
    let halfUnitPage = unitPage;

    if (page == unitPage || (page > unitPage && totalPages - (page - 1) >= unitPage)) {
      halfUnitPage = Math.floor(unitPage / 2);
    }

    if (page <= halfUnitPage) {
      currEndPage = unitPage;
      currStartPage = 1;
    } else if (page + halfUnitPage < totalPages) {
      currEndPage = page + halfUnitPage;
      currStartPage = currEndPage - unitPage + 1;
    } else {
      currEndPage = page + halfUnitPage;

      if (currEndPage > totalPages) {
        currEndPage = totalPages;
      }
      currStartPage = currEndPage - unitPage + 1;
    }
  }

  if (currEndPage > totalPages) currEndPage = totalPages;

  let prePage = 0;
  let prePage_is = false;
  if (currStartPage != 1) {
    prePage_is = true;
    prePage = currStartPage - 1;
  }

  let nextPage = 0;
  let nextPage_is = false;
  if (currEndPage != totalPages) {
    nextPage_is = true;
    nextPage = currEndPage + 1;
  }

  return {
    page: page,
    unitPage: unitPage,
    prePage: prePage,
    prePage_is: prePage_is,
    nextPage: nextPage,
    nextPage_is: nextPage_is,
    currStartPage: currStartPage,
    currEndPage: currEndPage,
    pageSize: pageSize,
    totalCount: totalCount,
    totalPages: totalPages,
  };
};
