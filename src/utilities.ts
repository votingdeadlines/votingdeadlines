import * as fs from 'fs'

export function logProgress(prefix: string, state: string, i: number): void {
  console.log(`${prefix} ${'.'.repeat(i)}${state}`)
}

export function readFile(path: string): string {
  return fs.readFileSync(path, { encoding: 'utf8' })
}

export function writeFile(path: string, contents: string): void {
  fs.writeFileSync(path, contents)
}
