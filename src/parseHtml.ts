import * as fs from 'fs'

import { JSDOM } from 'jsdom'

// The main I/O function in this file is `readParseAndWriteHtml`, which takes
// an input path and a desired selector, and writes it to an output file.

export function parseHtml(html: string, selector: string): string {
  const dom = new JSDOM(html)
  const parsedHtml = dom.window.document.querySelector(selector).outerHTML
  return parsedHtml
}

export function readAndParseHtml(htmlPath: string, selector: string): string {
  const html = readFile(htmlPath)
  const parsedHtml = parseHtml(html, selector)
  return parsedHtml
}

export function readParseAndWriteHtml(
  inputPath: string,
  selector: string,
  outputPath: string
): void {
  console.log(`Reading ${inputPath}.`)
  const parsedHtml = readAndParseHtml(inputPath, selector)
  console.log(`Writing ${outputPath}.`)
  writeFile(outputPath, parsedHtml)
}

//---------//
// Helpers //
//---------//

function readFile(path: string): string {
  return fs.readFileSync(path, { encoding: 'utf8' })
}

function writeFile(path: string, contents: string): void {
  fs.writeFileSync(path, contents)
}
