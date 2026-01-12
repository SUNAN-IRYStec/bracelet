/**
 * Converts a path to an absolute URL with the correct base URL
 * Handles both relative and absolute paths
 */
export function toAbsoluteUrl(path: string): string {
  // If path is already a full URL (http:// or https://), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const base = import.meta.env.BASE_URL;

  // If path starts with /, remove it since BASE_URL already includes the trailing /
  if (path.startsWith('/')) {
    path = path.substring(1);
  }

  return `${base}${path}`;
}
