import { EventManager } from '@/event/EventManager';

describe('EventManager cleanup', () => {
  it.each(['off', 'destroy'])('removes every registered handler with %s', (method) => {
    const manager = new EventManager();
    const element = document.createElement('button');
    const first = jest.fn();
    const second = jest.fn();
    manager.on({ el: element, type: 'click.test' }, first);
    manager.on({ el: element, type: 'click.test' }, second, { capture: true });
    element.click();
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    if (method === 'off') manager.off(element, 'click.test');
    else manager.destroy();
    element.click();
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });
});
