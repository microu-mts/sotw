export function splitCleanString(
  s: string,
  options: { separator?: string | RegExp; filter?: (s: string) => boolean } = {}
): string[] {
  const separator = options.separator ?? /\s+/;
  const filter = options.filter ?? ((s: string) => s.length > 0);
  const r = s.split(separator).filter(filter);
  return r;
}
