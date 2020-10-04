// This is meant to extract useful data from VOTE_ORG_GENERAL_FORMATTED_HTML_PATH.

import { parseHtml } from '../parseHtml'
import { UsaState, usaStates } from '../usaStates' // TODO: add DC, maybe territories
import { readFile, writeFile } from '../utilities'

interface VoteOrgRawData {
  [key: string]: string
}

// Parses Vote.org HTML into JSON data.
export function extractVoteOrgData(html: string): VoteOrgRawData {
  const rawData = usaStates.reduce(
    (memo: VoteOrgRawData, state: UsaState): VoteOrgRawData => {
      // The ID (#alabama) gets us the table row.
      // This longer selector just gets us the deadline data we want.
      // We could return the full HTML, but the text content is all we need.
      const stateId = `#${state.slug}`
      const selector = `${stateId} [data-title="Voter Registration Deadlines"]`
      const stateHtml = parseHtml(html, selector, 'textContent')
      memo[state.abbrev] = stateHtml.trim()
      return memo
    },
    {}
  )

  return rawData
}

// Reads an HTML file and parses it into JSON data.
export function readAndExtractVoteOrgData(htmlPath: string): VoteOrgRawData {
  const html = readFile(htmlPath)
  return extractVoteOrgData(html)
}

// Reads an HTML file and writes it as JSON data.
export function readExtractAndWriteVoteOrgData(
  inputPath: string,
  outputPath: string
): void {
  const rawData = readAndExtractVoteOrgData(inputPath)
  const rawJson = JSON.stringify(rawData, null, 2)
  writeFile(outputPath, rawJson)
}
