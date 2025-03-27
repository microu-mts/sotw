export function splitCleanString(
  s: string,
  options: { separator?: string | RegExp; filter?: (s: string) => boolean } = {}
): string[] {
  const separator = options.separator ?? /\s+/;
  const filter = options.filter ?? ((s: string) => s.length > 0);
  const r = s.split(separator).filter(filter);
  return r;
}
export function deduplicate<T>(items: T[]): T[] {
  const r = [] as T[];
  const itemSet = new Set<T>();
  for (const item of items) {
    if (!itemSet.has(item)) {
      r.push(item);
      itemSet.add(item);
    }
  }

  return r;
}
