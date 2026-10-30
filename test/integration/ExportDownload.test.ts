import { downloadExport } from '@/export/downloadExport';

describe('공통 내보내기 다운로드', () => {
  it.each([false, true])('클릭 성공·실패 시 링크와 URL을 정리한다 (실패: %s)', (fail) => {
    jest.useFakeTimers();
    const createDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
    const revokeDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
    const revoke = jest.fn();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:export') });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revoke });
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe('report.CSV');
      expect(this.href).toBe('blob:export');
      expect(document.body.contains(this)).toBe(true);
      if (fail) throw new Error('download failed');
    });
    try {
      const action = () => downloadExport(new Blob(), ' report.CSV ', 'export.csv', 'csv');
      if (fail) expect(action).toThrow('download failed');
      else action();
      expect(document.querySelector('a[href="blob:export"]')).toBeNull();
      expect(revoke).not.toHaveBeenCalled();
      jest.runAllTimers();
      expect(revoke).toHaveBeenCalledWith('blob:export');
    } finally {
      click.mockRestore();
      if (createDescriptor) Object.defineProperty(URL, 'createObjectURL', createDescriptor);
      else delete (URL as any).createObjectURL;
      if (revokeDescriptor) Object.defineProperty(URL, 'revokeObjectURL', revokeDescriptor);
      else delete (URL as any).revokeObjectURL;
      jest.useRealTimers();
    }
  });

  it('다운로드가 시작될 시간을 주기 위해 Object URL은 클릭 직후가 아니라 잠시 뒤에 해제한다', () => {
    jest.useFakeTimers();
    const createDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
    const revokeDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
    const revoke = jest.fn();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:export') });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revoke });
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    try {
      downloadExport(new Blob(), 'report', 'export.csv', 'csv');
      jest.advanceTimersByTime(9_999);
      expect(revoke).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1);
      expect(revoke).toHaveBeenCalledWith('blob:export');
    } finally {
      click.mockRestore();
      if (createDescriptor) Object.defineProperty(URL, 'createObjectURL', createDescriptor);
      else delete (URL as any).createObjectURL;
      if (revokeDescriptor) Object.defineProperty(URL, 'revokeObjectURL', revokeDescriptor);
      else delete (URL as any).revokeObjectURL;
      jest.useRealTimers();
    }
  });
});
