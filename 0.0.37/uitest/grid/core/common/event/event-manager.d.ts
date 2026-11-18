/**
 * 이벤트 등록을 관리합니다.
 * 등록 정보는 요소를 약하게 참조하므로 off 없이 DOM 에서 제거된 요소는 메모리에서 해제될 수 있고,
 * offAll 은 아직 살아 있는 요소의 리스너를 모두 제거합니다.
 */
export declare class EventManager {
    private registrations;
    private targets;
    private refs;
    private finalizer;
    on(el: Element | string | NodeList | null | Document | Element[], type: string, listener?: any, selector?: any, fnOpts?: any): void;
    /**
     * 등록한 이벤트를 제거합니다. "click" 은 네임스페이스와 관계없이 click 을 모두 제거하고,
     * "click.ns" 는 해당 네임스페이스만, ".ns" 는 이벤트 이름과 관계없이 해당 네임스페이스를 제거합니다.
     */
    off(el: Element | string | NodeList | null | Document | Element[], type: string): null | undefined;
    offAll(): void;
    private track;
    private untrack;
}
