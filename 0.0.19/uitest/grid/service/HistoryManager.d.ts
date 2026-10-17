import { ItemStatus } from '../constants.js';
import { RowId } from '../types/Common.js';
/**
 * Undo / Redo 이후 복원할 Selection 정보입니다.
 * row index는 저장하지 않고 rowId를 저장합니다.
 */
export interface HistorySelection {
    startRowId: RowId;
    endRowId: RowId;
    startCol: number;
    endCol: number;
}
/**
 * 하나의 셀 변경 정보입니다.
 */
export interface UpdateHistoryChange {
    type: 'update';
    rowId: RowId;
    fieldName: string;
    beforeValue: any;
    afterValue: any;
    beforeStatus: ItemStatus;
    afterStatus: ItemStatus;
}
/**
 * 행 추가 정보입니다.
 */
export interface AddHistoryChange {
    type: 'add';
    rowId: RowId;
    item: any;
}
/**
 * 행 삭제 정보입니다.
 */
export interface RemoveHistoryChange {
    type: 'remove';
    rowId: RowId;
    item: any;
}
export type HistoryChange = UpdateHistoryChange | AddHistoryChange | RemoveHistoryChange;
/**
 * 하나의 Undo / Redo 단위입니다.
 *
 * 붙여넣기처럼 여러 셀이 한 번에 변경되는 작업은
 * 하나의 HistoryEntry로 묶습니다.
 */
export interface HistoryEntry {
    changes: HistoryChange[];
    beforeSelection?: HistorySelection;
    afterSelection?: HistorySelection;
}
/**
 * Grid 데이터 변경 History를 관리합니다.
 *
 * 실제 데이터는 관리하지 않고 변경 정보만 저장합니다.
 */
export declare class HistoryManager {
    static readonly DEFAULT_MAX_COUNT = 100;
    private readonly undoStack;
    private readonly redoStack;
    private currentEntry;
    private suspended;
    private maxCount;
    constructor(maxCount?: number);
    /**
     * 최대 History Entry 개수를 변경합니다.
     *
     * 새로 설정한 개수보다 현재 History가 많으면
     * 가장 오래된 Entry부터 제거합니다.
     */
    setMaxCount(maxCount: number): void;
    /**
     * 현재 최대 History Entry 개수입니다.
     */
    getMaxCount(): number;
    private normalizeMaxCount;
    /**
     * 최대 개수를 초과한 가장 오래된 History를 제거합니다.
     */
    private trimStack;
    private pushUndo;
    /**
     * Transaction을 시작합니다.
     */
    begin(beforeSelection?: HistorySelection): void;
    /**
     * 현재 Transaction을 Undo Stack에 등록합니다.
     */
    commit(afterSelection?: HistorySelection): void;
    /**
     * 아직 commit되지 않은 Transaction을 폐기합니다.
     * 실제 데이터는 되돌리지 않습니다.
     */
    rollback(): void;
    /**
     * 변경 정보를 등록합니다.
     * Transaction 중이면 현재 Entry에 추가하고,
     * 그렇지 않으면 단일 Entry로 등록합니다.
     */
    add(change: HistoryChange, beforeSelection?: HistorySelection, afterSelection?: HistorySelection): void;
    /**
     * Undo 가능한지 반환합니다.
     */
    canUndo(): boolean;
    /**
     * Redo 가능한지 반환합니다.
     */
    canRedo(): boolean;
    /**
     * Undo Entry를 꺼내고 Redo Stack으로 이동합니다.
     */
    undo(): HistoryEntry | undefined;
    /**
     * Redo Entry를 꺼내고 Undo Stack으로 이동합니다.
     */
    redo(): HistoryEntry | undefined;
    /**
     * History 기록을 일시 중지합니다.
     * 반환값은 호출 전 상태입니다.
     */
    suspend(): boolean;
    /**
     * History 기록을 재개합니다.
     */
    resume(previous?: boolean): void;
    /**
     * History 전체를 초기화합니다.
     */
    clear(): void;
    getUndoCount(): number;
    getRedoCount(): number;
}
