import type { RowId } from '@/types/Common';

const isRow = (item: any): item is Record<string, any> =>
  item !== null && typeof item === 'object' && !Array.isArray(item);

/** 잘못된 행만 제외한다. ID는 첫 행/기존 행 우선이며 누락 ID는 초기화 단계에서 생성한다. */
export function filterInputRows(
  items: any[],
  idFields: string[],
  existing: Iterable<any> = [],
  childrenField?: string,
): any[] {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');
  const ids = idFields.map(() => new Set<RowId>());
  const seen = new Set<any>();
  for (const item of existing) {
    seen.add(item);
    idFields.forEach((field, index) => {
      if (item[field] != null) ids[index].add(item[field]);
    });
  }

  // 중첩 입력을 변경하기 전에 순환에 참여하는 객체를 찾는다. 깊이에 비례한 호출 스택을 사용하지 않는다.
  const children = new Map<any, any[]>();
  const cyclic = new Set<any>();
  if (childrenField) {
    const done = new Set<any>();
    const order: any[] = [];
    const parents = new Map<any, any[]>();
    const stack = items
      .slice()
      .reverse()
      .map((item) => ({ item, exit: false }));
    while (stack.length) {
      const { item, exit } = stack.pop()!;
      if (!isRow(item)) continue;
      if (exit) {
        order.push(item);
        continue;
      }
      if (done.has(item)) continue;
      done.add(item);
      const list = Array.isArray(item[childrenField]) ? item[childrenField] : [];
      children.set(item, list);
      for (const child of list) {
        if (!isRow(child)) continue;
        const incoming = parents.get(child) ?? [];
        incoming.push(item);
        parents.set(child, incoming);
      }
      stack.push({ item, exit: true });
      for (let index = list.length - 1; index >= 0; index--) stack.push({ item: list[index], exit: false });
    }
    // 역방향 그래프의 강결합 요소로 교차 연결을 포함한 모든 순환 구성원을 찾는다.
    done.clear();
    for (const item of order.reverse()) {
      if (done.has(item)) continue;
      const component: any[] = [];
      const pending = [item];
      done.add(item);
      while (pending.length) {
        const row = pending.pop()!;
        component.push(row);
        for (const parent of parents.get(row) ?? []) {
          if (!done.has(parent)) {
            done.add(parent);
            pending.push(parent);
          }
        }
      }
      if (component.length > 1 || children.get(item)?.includes(item)) {
        for (const row of component) cyclic.add(row);
      }
    }
  }

  const result: any[] = [];
  const visited = new Set<any>();
  const stack = items
    .slice()
    .reverse()
    .map((item) => ({ item, target: result }));
  while (stack.length) {
    const { item, target } = stack.pop()!;
    if (!isRow(item) || visited.has(item)) continue;
    visited.add(item);
    const values = idFields.map((field) => item[field]);
    const invalid = values.some(
      (id, index) =>
        id != null &&
        ((typeof id !== 'string' && typeof id !== 'number') ||
          (typeof id === 'number' && !Number.isFinite(id)) ||
          ids[index].has(id)),
    );
    const accepted = !seen.has(item) && !cyclic.has(item) && !invalid;
    let childTarget = target;
    if (accepted) {
      values.forEach((id, index) => {
        if (id != null) ids[index].add(id);
      });
      target.push(item);
      if (childrenField && item[childrenField] != null) {
        childTarget = [];
        item[childrenField] = childTarget;
      }
    }
    // 제외된 부모의 정상 자손은 가장 가까운 유효 부모(없으면 루트)에 남긴다.
    const list = children.get(item) ?? [];
    for (let index = list.length - 1; index >= 0; index--) stack.push({ item: list[index], target: childTarget });
  }
  return result;
}

/** 부모를 하나만 갖는 flat 트리에서 순환 구성원만 제외하고 정상 자손은 보존한다. */
export function excludeParentCycles(items: any[], idField: string, parentField: string): any[] {
  const byId = new Map(items.filter((item) => item[idField] != null).map((item) => [item[idField], item]));
  const done = new Set<any>();
  const cyclic = new Set<any>();
  for (const item of items) {
    const path: any[] = [];
    const active = new Map<any, number>();
    let current = item;
    while (current && !done.has(current) && !active.has(current)) {
      active.set(current, path.length);
      path.push(current);
      current = current[parentField] == null ? undefined : byId.get(current[parentField]);
    }
    const start = active.get(current);
    if (start !== undefined) for (let index = start; index < path.length; index++) cyclic.add(path[index]);
    for (const row of path) done.add(row);
  }
  return items.filter((item) => !cyclic.has(item));
}
