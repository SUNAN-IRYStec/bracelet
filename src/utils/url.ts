/**
 * Converts a path to an absolute URL with the correct base URL.
 * Handles both relative and absolute paths.
 */
export function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const base = import.meta.env.BASE_URL;
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

  return `${base}${normalizedPath}`;
}
