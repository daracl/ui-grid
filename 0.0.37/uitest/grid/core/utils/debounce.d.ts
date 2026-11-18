export interface DebouncedFunction<Args extends unknown[], Context> {
    (this: Context, ...args: Args): void;
    cancel(): void;
}
/** 호출을 지연하고 마지막 인자·this를 보존합니다. cancel로 타이머를 정리합니다. */
export declare function debounce<Args extends unknown[], Context>(callback: (this: Context, ...args: Args) => void, delay: number): DebouncedFunction<Args, Context>;
