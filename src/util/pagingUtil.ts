import { PagingParam } from '@/types/GridOptions';
import { PagingInfo } from '@t/PagingInfo';

/**
 *  페이징 파라미터를 페이징 정보로 변환
 * @param pagingParam 페이징 파라미터
 * @param rowLength 전체 row 수
 * @returns
 */
export const getPagingParamToPagingInfo = (pagingParam: PagingParam, rowLength: number): PagingInfo => {
  const currPage = pagingParam?.currPage || 1;
  const totalCount = pagingParam?.totalCount ?? rowLength;
  const countPerPage = pagingParam?.countPerPage || 10;
  const unitPage = pagingParam?.unitPage || 10;

  return getPagingInfo(totalCount > 0 ? totalCount : rowLength, currPage, countPerPage, unitPage);
};

/**
 * 페이징 정보 얻기
 ;*
 * @param {number} totalCount 전체 row 수
 * @param {number} currPage  현재 페이지 number
 * @param {number} countPerPage 한페이지에 보여질 row 수
 * @param {number} unitPage 한페이지에 보여질 페이지 수
 * @returns {PagingInfo} 페이징 정보
 */
export const getPagingInfo = (
  totalCount: number,
  currPage: number,
  countPerPage: number,
  unitPage: number,
): PagingInfo => {
  countPerPage = countPerPage || 10;
  unitPage = unitPage || 10;

  if (totalCount < 1) {
    return {
      currPage: 0,
      unitPage: 0,
      totalCount: 0,
      totalPage: 0,
    } as PagingInfo;
  }

  if (totalCount < countPerPage) {
    countPerPage = totalCount;
  }

  const totalPage =
    totalCount % countPerPage == 0 ? totalCount / countPerPage : Math.floor(totalCount / countPerPage) + 1;

  if (totalPage < currPage) {
    currPage = totalPage;
  }

  let currStartPage;
  let currEndPage;

  if (totalPage <= unitPage) {
    currEndPage = totalPage;
    currStartPage = 1;
  } else {
    let halfUnitPage = unitPage;

    if (currPage == unitPage || (currPage > unitPage && totalPage - (currPage - 1) >= unitPage)) {
      halfUnitPage = Math.floor(unitPage / 2);
    }

    if (currPage <= halfUnitPage) {
      currEndPage = unitPage;
      currStartPage = 1;
    } else if (currPage + halfUnitPage < totalPage) {
      currEndPage = currPage + halfUnitPage;
      currStartPage = currEndPage - unitPage + 1;
    } else {
      currEndPage = currPage + halfUnitPage;

      if (currEndPage > totalPage) {
        currEndPage = totalPage;
      }
      currStartPage = currEndPage - unitPage + 1;
    }
  }

  if (currEndPage > totalPage) currEndPage = totalPage;

  let prePage = 0;
  let prePage_is = false;
  if (currStartPage != 1) {
    prePage_is = true;
    prePage = currStartPage - 1;
  }

  let nextPage = 0;
  let nextPage_is = false;
  if (currEndPage != totalPage) {
    nextPage_is = true;
    nextPage = currEndPage + 1;
  }

  return {
    currPage: currPage,
    unitPage: unitPage,
    prePage: prePage,
    prePage_is: prePage_is,
    nextPage: nextPage,
    nextPage_is: nextPage_is,
    currStartPage: currStartPage,
    currEndPage: currEndPage,
    countPerPage: countPerPage,
    totalCount: totalCount,
    totalPage: totalPage,
  };
};
