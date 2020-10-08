export function stringToSlug(string: string): string {
  const lcString = string.toLowerCase()
  const saferString = lcString
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return saferString
}
