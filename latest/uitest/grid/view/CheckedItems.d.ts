import { DataManager } from '../service/DataManager.js';
/**
 * 체크된 행을 화면 표시 순서대로 모은다.
 *
 * @param dataManager 데이터 관리자
 * @param names 가져올 필드명. 생략하면 행 전체를 반환하고, 지정하면 해당 필드만 담은 객체를 반환한다.
 * @returns 체크된 행 배열
 */
export declare function collectCheckedItems(dataManager: DataManager, names?: string | string[]): Record<string, unknown>[];
