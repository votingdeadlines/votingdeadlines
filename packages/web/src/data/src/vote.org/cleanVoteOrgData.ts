// This is meant to clean up the raw JSON into something more usable.

import { UsaState, usaStates } from '../usaStates' // TODO: add DC, maybe territories
import { readFile, writeFile } from '../utilities'

//-------//
// Types //
//-------//

// An individual state's data.
export interface VOCleanedState {
  InPerson: null | string
  ByMail: null | string
  Online: null | string
}

export interface VOCleanedData {
  [key: string]: VOCleanedState
}

//---------//
// Methods //
//---------//

// Cleans up an individual state's raw JSON data.
export function cleanState(rawState: string): VOCleanedState {
  // This is a bit fragile. We could also try the non-formatted HTML.
  const split = rawState.split('\n          \n          \n')
  const cleanedState = {
    InPerson: cleanDeadline(split, 'In Person:'),
    ByMail: cleanDeadline(split, 'By Mail:'),
    Online: cleanDeadline(split, 'Online:'),
  }
  // TODO: check if there is other data in `split`
  // TODO: add same-day registration info
  return cleanedState
}

// Removes whitespace and the heading text.
function cleanDeadline(deadlines: Array<string>, heading: string): string {
  const deadline = deadlines.find((e) => new RegExp(heading).test(e))
  const cleaned = deadline.replace(heading, '').trim()
  return cleaned.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')
}

// Cleans up Vote.org raw JSON data.
export function cleanVoteOrgData(
  rawJson: string,
  entities = usaStates
): VOCleanedData {
  const rawData = JSON.parse(rawJson)
  const cleanedData = entities.reduce(
    (memo: VOCleanedData, state: UsaState): VOCleanedData => {
      const rawState = rawData[state.abbrev]

      if (!rawState) {
        throw new Error(`Could not find state ${state.abbrev} in raw data.`)
      }

      memo[state.abbrev] = cleanState(rawState)
      return memo
    },
    {}
  )

  return cleanedData
}

// Reads and cleans up Vote.org raw JSON data.
export function readAndCleanVoteOrgData(
  jsonPath: string,
  entities = usaStates
): VOCleanedData {
  const json = readFile(jsonPath)
  return cleanVoteOrgData(json, entities)
}

// Reads Vote.org raw JSON data and writes a cleaned-up version.
export function readCleanAndWriteVoteOrgData(
  inputPath: string,
  outputPath: string,
  entities = usaStates
): void {
  const cleanedData = readAndCleanVoteOrgData(inputPath, entities)
  const cleanedJson = JSON.stringify(cleanedData, null, 2)
  writeFile(outputPath, cleanedJson)
}
