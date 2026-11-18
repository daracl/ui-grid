/** 잘못된 행만 제외한다. ID는 첫 행/기존 행 우선이며 누락 ID는 초기화 단계에서 생성한다. */
export declare function filterInputRows(items: any[], idFields: string[], existing?: Iterable<any>, childrenField?: string): any[];
/** 부모를 하나만 갖는 flat 트리에서 순환 구성원만 제외하고 정상 자손은 보존한다. */
export declare function excludeParentCycles(items: any[], idField: string, parentField: string): any[];
