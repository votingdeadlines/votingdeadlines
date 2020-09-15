import { JSDOM } from 'jsdom'

import { readFile, writeFile } from './utilities'

// The main I/O function in this file is `readParseAndWriteHtml`, which takes
// an input path and a desired selector, and writes it to an output file.

export function parseHtml(
  html: string,
  selector: string,
  attribute = 'outerHTML'
): string {
  const dom = new JSDOM(html)
  const parsedHtml = dom.window.document.querySelector(selector)

  if (!parsedHtml) {
    throw new Error(`Could not find HTML for selector ${selector}.`)
  }

  return attribute ? parsedHtml[attribute] : parsedHtml
}

export function parseHtmlV2(
  html: string,
  selector: string
  // options: parseHtmlV2Options = {}
): Array<Node> {
  const dom = new JSDOM(html)
  const nodes = dom.window.document.querySelectorAll(selector)

  if (!nodes) {
    throw new Error(`Could not find nodes for selector ${selector}.`)
  }

  return Array.from(nodes)
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
