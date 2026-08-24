import { ItemStatus } from '@/constants';
import { RowId } from '@/types/Common';

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
export class HistoryManager {
  public static readonly DEFAULT_MAX_COUNT = 100;

  private readonly undoStack: HistoryEntry[] = [];
  private readonly redoStack: HistoryEntry[] = [];

  private currentEntry: HistoryEntry | null = null;
  private suspended = false;

  private maxCount: number;

  constructor(maxCount = HistoryManager.DEFAULT_MAX_COUNT) {
    this.maxCount = this.normalizeMaxCount(maxCount);
  }

  /**
   * 최대 History Entry 개수를 변경합니다.
   *
   * 새로 설정한 개수보다 현재 History가 많으면
   * 가장 오래된 Entry부터 제거합니다.
   */
  public setMaxCount(maxCount: number): void {
    this.maxCount = this.normalizeMaxCount(maxCount);
    this.trimStack(this.undoStack);
    this.trimStack(this.redoStack);
  }

  /**
   * 현재 최대 History Entry 개수입니다.
   */
  public getMaxCount(): number {
    return this.maxCount;
  }

  private normalizeMaxCount(maxCount: number): number {
    if (!Number.isFinite(maxCount)) {
      return HistoryManager.DEFAULT_MAX_COUNT;
    }

    return Math.max(0, Math.floor(maxCount));
  }

  /**
   * 최대 개수를 초과한 가장 오래된 History를 제거합니다.
   */
  private trimStack(stack: HistoryEntry[]): void {
    if (stack.length <= this.maxCount) {
      return;
    }

    stack.splice(0, stack.length - this.maxCount);
  }

  private pushUndo(entry: HistoryEntry): void {
    if (this.maxCount === 0) {
      return;
    }

    this.undoStack.push(entry);
    this.trimStack(this.undoStack);
  }

  /**
   * Transaction을 시작합니다.
   */
  public begin(beforeSelection?: HistorySelection): void {
    if (this.suspended || this.currentEntry) {
      return;
    }

    this.currentEntry = {
      changes: [],
      beforeSelection,
    };
  }

  /**
   * 현재 Transaction을 Undo Stack에 등록합니다.
   */
  public commit(afterSelection?: HistorySelection): void {
    if (this.suspended) {
      return;
    }

    const entry = this.currentEntry;
    this.currentEntry = null;

    if (!entry || entry.changes.length === 0) {
      return;
    }

    entry.afterSelection = afterSelection;

    this.pushUndo(entry);
    this.redoStack.length = 0;
  }

  /**
   * 아직 commit되지 않은 Transaction을 폐기합니다.
   * 실제 데이터는 되돌리지 않습니다.
   */
  public rollback(): void {
    this.currentEntry = null;
  }

  /**
   * 변경 정보를 등록합니다.
   * Transaction 중이면 현재 Entry에 추가하고,
   * 그렇지 않으면 단일 Entry로 등록합니다.
   */
  public add(change: HistoryChange, beforeSelection?: HistorySelection, afterSelection?: HistorySelection): void {
    if (this.suspended) {
      return;
    }

    if (this.currentEntry) {
      // Transaction에서는 개별 변경의 Selection을 기록하지 않습니다.
      // commit()에서 최종 Selection을 afterSelection으로 기록합니다.
      this.currentEntry.changes.push(change);
      return;
    }

    this.pushUndo({
      changes: [change],
      beforeSelection,
      afterSelection: afterSelection ?? beforeSelection,
    });

    this.redoStack.length = 0;
  }

  /**
   * Undo 가능한지 반환합니다.
   */
  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Redo 가능한지 반환합니다.
   */
  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Undo Entry를 꺼내고 Redo Stack으로 이동합니다.
   */
  public undo(): HistoryEntry | undefined {
    if (this.currentEntry) {
      this.commit();
    }

    const entry = this.undoStack.pop();

    if (!entry) {
      return undefined;
    }

    if (this.maxCount > 0) {
      this.redoStack.push(entry);
      this.trimStack(this.redoStack);
    }

    return entry;
  }

  /**
   * Redo Entry를 꺼내고 Undo Stack으로 이동합니다.
   */
  public redo(): HistoryEntry | undefined {
    const entry = this.redoStack.pop();

    if (!entry) {
      return undefined;
    }

    this.pushUndo(entry);
    return entry;
  }

  /**
   * History 기록을 일시 중지합니다.
   * 반환값은 호출 전 상태입니다.
   */
  public suspend(): boolean {
    const previous = this.suspended;
    this.suspended = true;
    return previous;
  }

  /**
   * History 기록을 재개합니다.
   */
  public resume(previous = false): void {
    this.suspended = previous;
  }

  /**
   * History 전체를 초기화합니다.
   */
  public clear(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.currentEntry = null;
  }

  public getUndoCount(): number {
    return this.undoStack.length;
  }

  public getRedoCount(): number {
    return this.redoStack.length;
  }
}
