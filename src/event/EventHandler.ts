export interface EventHandler {
  init(): void;
  destroy?(): void;
}
