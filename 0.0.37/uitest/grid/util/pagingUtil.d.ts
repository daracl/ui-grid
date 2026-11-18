import { PagingParam } from '../types/GridOptions.js';
import { PagingInfo } from '../types/PagingInfo.js';
/**
 *  페이징 파라미터를 페이징 정보로 변환
 * @param pagingParam 페이징 파라미터
 * @param rowLength 전체 row 수
 * @returns
 */
export declare const getPagingParamToPagingInfo: (pagingParam: PagingParam, rowLength: number) => PagingInfo;
/**
 * 페이징 정보 얻기
 ;*
 * @param {number} totalCount 전체 row 수
 * @param {number} page  현재 페이지 number
 * @param {number} pageSize 한페이지에 보여질 row 수
 * @param {number} unitPage 한페이지에 보여질 페이지 수
 * @returns {PagingInfo} 페이징 정보
 */
export declare const getPagingInfo: (totalCount: number, page: number, pageSize: number, unitPage: number) => PagingInfo;
