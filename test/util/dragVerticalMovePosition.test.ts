import { ScrollDirectionYMap } from '@/constants';
import { dragVerticalMovePosition } from '@/util/gridUtils';

/** 드래그 중 세로 위치 → 행 인덱스 계산 테스트 */
describe('dragVerticalMovePosition', () => {
  const ROW_HEIGHT = 20;
  const TOP = 100;
  const BOTTOM = 400; // body 높이 300 → 최대 15행 표시

  const cfg = (rowLength: number, startIdx = 0, insideViewRow = 14) =>
    ({
      scroll: { startIdx, insideViewRow, viewRow: Math.min(rowLength - startIdx, 15) },
      dataInfo: { rowLength },
    }) as any;

  const move = (c: any, y: number) => dragVerticalMovePosition(c, y, ROW_HEIGHT, {} as any, TOP, BOTTOM);

  it('행 위에서는 해당 행 인덱스를 반환한다', () => {
    expect(move(cfg(5), TOP + ROW_HEIGHT * 2 + 5)).toEqual({ scrollDirectionY: null, rowIdx: 2, viewRowIdx: 2 });
    expect(move(cfg(100, 10), TOP + 5).rowIdx).toBe(10);
  });

  it('데이터 행 아래 빈 영역에서는 화면에 그려진 마지막 데이터 행을 반환한다', () => {
    // 5행 데이터, body 안쪽 10번째 행 위치(빈 영역)
    const result = move(cfg(5), TOP + ROW_HEIGHT * 10 + 5);
    expect(result.rowIdx).toBe(4);
    expect(result.scrollDirectionY).toBeNull();

    // 마지막 행 바로 아래
    expect(move(cfg(5), TOP + ROW_HEIGHT * 5 + 1).rowIdx).toBe(4);
  });

  it('스크롤된 상태의 빈 영역에서도 마지막 데이터 행을 반환한다', () => {
    // 20행 중 startIdx 12 → 화면에 8행(12~19)만 존재
    expect(move(cfg(20, 12), TOP + ROW_HEIGHT * 12).rowIdx).toBe(19);
  });

  it('위쪽 바깥은 스크롤 가능하면 UP, 아니면 0행을 반환한다', () => {
    expect(move(cfg(5), TOP - 10)).toEqual({ scrollDirectionY: null, rowIdx: 0, viewRowIdx: 0 });
    expect(move(cfg(100, 10), TOP - 10)).toEqual({
      scrollDirectionY: ScrollDirectionYMap.UP,
      rowIdx: 9,
      viewRowIdx: 0,
    });
  });

  it('아래쪽 바깥은 스크롤 가능하면 DOWN, 아니면 마지막 행을 반환한다', () => {
    expect(move(cfg(5), BOTTOM + 10)).toEqual({ scrollDirectionY: null, rowIdx: 4, viewRowIdx: 14 });
    expect(move(cfg(100), BOTTOM + 10)).toEqual({
      scrollDirectionY: ScrollDirectionYMap.DOWN,
      rowIdx: 15,
      viewRowIdx: 14,
    });
  });

  it('rowLength 가 0 이면 빈 영역에서 -1 을 유지한다', () => {
    const c = { scroll: { startIdx: 0, insideViewRow: 14, viewRow: 0 }, dataInfo: { rowLength: 0 } } as any;
    expect(move(c, TOP + 50).rowIdx).toBe(-1);
  });
});
