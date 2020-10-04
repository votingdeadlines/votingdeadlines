import { parseHtmlV2 } from '../parseHtml'
import { readFile, writeFile } from '../utilities'
import { usaStatesAndDc, UsaState } from '../usaStates'

export type RawVARegStatusData = {
  [key: string]: string | null
}

// This is a janky way to coerce a Node into an HTMLAnchorElement-like object.
type HTMLLink = {
  href?: string
}

export function extractVARegStatusData(html: string): RawVARegStatusData {
  const rawData = usaStatesAndDc.reduce(
    (memo: RawVARegStatusData, state: UsaState): RawVARegStatusData => {
      const stateName = state.name || 'Alaska' // TODO: simplify
      const stateSelector = `a[title="Official ${stateName} voter registration lookup"]`
      const link = <HTMLLink>parseHtmlV2(html, stateSelector)[0]

      memo[state.abbrev] = link.href || null

      return memo
    },
    {}
  )

  return rawData
}

// Reads an HTML file and writes it as JSON data.
export function readExtractAndWriteVARegStatusData(
  inputPath: string,
  outputPath: string
): void {
  const html = readFile(inputPath)
  const rawData = extractVARegStatusData(html)
  const rawJson = JSON.stringify(rawData, null, 2)
  writeFile(outputPath, rawJson)
}
