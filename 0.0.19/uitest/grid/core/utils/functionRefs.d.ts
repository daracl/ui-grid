export type ErrorFactory = (message: string) => Error;
export type FunctionRegistry = Record<string, (...args: never[]) => unknown>;
export declare const FUNCTION_REF_PREFIX = "@fn:";
/** 컴포넌트 접두사를 붙이는 Error 생성 함수를 반환합니다. */
export declare function createErrorFactory(prefix: string): ErrorFactory;
/** JSON 구문 오류를 지정한 Error 생성 함수로 전달합니다. */
export declare function parseJson(json: string, createError?: ErrorFactory): unknown;
/** 등록된 함수는 @fn:이름으로 저장하고 제외된 함수 경로도 반환합니다. */
export declare function stringifyWithFunctions(value: unknown, functions?: FunctionRegistry): {
    json: string | undefined;
    omitted: string[];
};
/** @fn: 참조를 등록된 함수로 복원하며 상속된 함수 이름은 허용하지 않습니다. */
export declare function restoreFunctions<T>(value: unknown, functions?: FunctionRegistry, createError?: ErrorFactory, path?: string): T;
/** 객체 설정 JSON을 해석하고 함수 참조를 복원합니다. */
export declare function parseConfigJson<T>(json: string, functions?: FunctionRegistry, createError?: ErrorFactory): T;
/** 선택한 텍스트 파일을 문자열로 읽습니다. */
export declare function readTextFile(file: Blob): Promise<string>;
