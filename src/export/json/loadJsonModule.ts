export function loadJsonModule(): Promise<typeof import('./JsonExport')> {
  return import('./JsonExport');
}
