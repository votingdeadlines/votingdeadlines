// TODO: DRY with data/bin

import * as fs from 'fs'
import * as child_process from 'child_process'
import * as path from 'path'

export function exec(cmd: string): string {
  return child_process.execSync(cmd, { encoding: 'utf8' })
}

export const resolve = path.resolve

export function readFile(path: string): string {
  return fs.readFileSync(path, { encoding: 'utf8' })
}

export function writeFile(path: string, contents: string): void {
  fs.writeFileSync(path, contents)
}
