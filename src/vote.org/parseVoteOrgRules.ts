// This is meant to clean up the raw JSON into something more usable.

import { VOCleanedState } from './cleanVoteOrgData'
import { UsaEntity, usaStates } from './usaStates'
import { readFile, writeFile } from './utilities'

//-------//
// Types //
//-------//

// State types
//-------------

// A map of all 50+ states'/jurisdictions' rules data.
type VORulesetsMap = {
  [key: string]: VOEntityRuleset
}

// An individual state's rules data.
type VOEntityRuleset = VOEntitySimpleRuleset | VOEntityFreeformRuleset

// A "simple" uniony case. Possibly better than the "simplest" approach.
type VOEntitySimpleRuleset = {
  kind: 'simple'
  InPerson: InPersonDeadlines
  ByMail: ByMailDeadlines
  Online: OnlineDeadlines
}

// TODO: more non-simplest but still manageable cases.
// TODO: COVID exceptions

// State rulesets that have not been more specifically typed out.
type VOEntityFreeformRuleset = {
  kind: 'freeform'
  InPerson: string
  ByMail: string
  Online: string
}

// Deadline types
//----------------

type InPersonDeadlines = InPersonDaysBeforeElection | InPersonOnElectionDay

type InPersonDaysBeforeElection = {
  kind: 'InPersonDaysBeforeElection'
  daysBefore: number
}

type InPersonOnElectionDay = {
  kind: 'InPersonOnElectionDay'
}

type ByMailDeadlines = PostmarkedDaysBeforeElection | ReceivedDaysBeforeElection

type PostmarkedDaysBeforeElection = {
  kind: 'PostmarkedDaysBeforeElection'
  daysBefore: number
}

type ReceivedDaysBeforeElection = {
  kind: 'ReceivedDaysBeforeElection'
  daysBefore: number
}

type OnlineDeadlines = OnlineDaysBeforeElection | OnlineNotAvailable

type OnlineDaysBeforeElection = {
  kind: 'OnlineDaysBeforeElection'
  daysBefore: number
}

type OnlineNotAvailable = {
  kind: 'OnlineNotAvailable'
}

//-----------------//
// Parsing methods //
//-----------------//

// Regexes
const daysBeforeElectionRx = /^(\d{1,3}) days before Election Day\.?$/
const onElectionDayRx = /^Election Day\.?$/
const postmarkedDaysBeforeElectionRx = /^Postmarked (\d{1,3}) days before Election Day\.?$/
const receivedDaysBeforeElectionRx = /^Received (\d{1,3}) days before Election Day\.?$/
const naRx = /^N\/A\.?$/

// Parse the JSON data for an individual state.
function parseVOStateRules(cleanedState: VOCleanedState): VOEntityRuleset {
  const ruleset =
    _parseSimpleRuleset(cleanedState) || _parseFreeformRuleset(cleanedState)

  return ruleset
}

// Parse states with simpler guidelines with the "simple" union type above.
function _parseSimpleRuleset(
  cleanedState: VOCleanedState
): VOEntitySimpleRuleset | false {
  const { InPerson, ByMail, Online } = cleanedState

  const _ruleset = { Online: null, ByMail: null, InPerson: null }

  // Online
  //--------

  const olMatch = Online.match(daysBeforeElectionRx)
  if (olMatch) {
    _ruleset.Online = {
      kind: 'OnlineDaysBeforeElection',
      daysBefore: Number(olMatch[1]),
    }
  }

  const olNaMatch = Online.match(naRx)
  if (olNaMatch) {
    _ruleset.Online = { kind: 'OnlineNotAvailable' }
  }

  // If there is anything complex about the online deadline, bail.
  const isSimpleOlDeadline = olMatch || olNaMatch
  if (!isSimpleOlDeadline) return false

  // ByMail
  //--------

  const bmPostmarkedMatch = ByMail.match(postmarkedDaysBeforeElectionRx)
  if (bmPostmarkedMatch) {
    _ruleset.ByMail = {
      kind: 'PostmarkedDaysBeforeElection',
      daysBefore: Number(bmPostmarkedMatch[1]),
    }
  }

  const bmReceivedMatch = ByMail.match(receivedDaysBeforeElectionRx)
  if (bmReceivedMatch) {
    _ruleset.ByMail = {
      kind: 'ReceivedDaysBeforeElection',
      daysBefore: Number(bmReceivedMatch[1]),
    }
  }

  // If there is anything complex about the by mail deadline, bail.
  const isSimpleBmDeadline = bmPostmarkedMatch || bmReceivedMatch
  if (!isSimpleBmDeadline) return false

  // InPerson
  //----------

  const ipDaysBeforeMatch = InPerson.match(daysBeforeElectionRx)
  if (ipDaysBeforeMatch) {
    _ruleset.InPerson = {
      kind: 'InPersonDaysBeforeElection',
      daysBefore: Number(ipDaysBeforeMatch[1]),
    }
  }

  const ipOnElectionDayMatch = InPerson.match(onElectionDayRx)
  if (ipOnElectionDayMatch) {
    _ruleset.InPerson = { kind: 'InPersonOnElectionDay' }
  }

  // If there is anything complex about the in person deadline, bail.
  const isSimpleIpDeadline = ipDaysBeforeMatch || ipOnElectionDayMatch
  if (!isSimpleIpDeadline) return false

  // Final sanity check that the numbers aren't unusual. Seeing 0 or 1 as the
  // number of days would pass the regexes but might indicate a problem.
  const numbersArray = [
    _ruleset.InPerson.daysBefore,
    _ruleset.ByMail.daysBefore,
    _ruleset.Online.daysBefore,
  ]
  const funnyNumbers = numbersArray.includes(0) || numbersArray.includes(1)
  if (funnyNumbers) return false

  // The happy case.
  const ruleset: VOEntitySimpleRuleset = {
    kind: 'simple',
    InPerson: _ruleset.InPerson,
    ByMail: _ruleset.ByMail,
    Online: _ruleset.Online,
  }

  return ruleset
}

// Fallback for states whose rulesets are more complicated or not yet supported.
function _parseFreeformRuleset(
  cleanedState: VOCleanedState
): VOEntityFreeformRuleset {
  const dummyRuleset: VOEntityFreeformRuleset = {
    kind: 'freeform',
    InPerson: cleanedState.InPerson,
    ByMail: cleanedState.ByMail,
    Online: cleanedState.Online,
  }
  return dummyRuleset
}

// Parse the JSON data for all states.
export function parseVORules(
  cleanedJson: string,
  entities = usaStates
): VORulesetsMap {
  const cleanedData = JSON.parse(cleanedJson)

  const rulesetMap = entities.reduce(
    (memo: VORulesetsMap, state: UsaEntity): VORulesetsMap => {
      const cleanedState: VOCleanedState = cleanedData[state.abbrev]
      if (!cleanedState) {
        throw new Error(`Could not find state ${state.abbrev} in cleaned data.`)
      }

      memo[state.abbrev] = parseVOStateRules(cleanedState)

      return memo
    },
    {}
  )

  return _sortVORules(rulesetMap)
}

function _sortVORules(rulesetMap: VORulesetsMap): VORulesetsMap {
  const sortedRules = {}

  // First add non-freeform rules, then freeform rules
  const rulesetEntries = Object.entries(rulesetMap)
  const freeform = rulesetEntries.filter((e) => e[1].kind === 'freeform')
  const nonFreeform = rulesetEntries.filter((e) => e[1].kind !== 'freeform')
  nonFreeform.forEach((e) => (sortedRules[e[0]] = e[1]))
  freeform.forEach((e) => (sortedRules[e[0]] = e[1]))

  return sortedRules
}

//-----//
// I/O //
//-----//

// Reads cleaned JSON data, tries to parse it, and writes the result.
export function readParseAndWriteVORules(
  inputPath: string,
  outputPath: string,
  entities = usaStates
): void {
  const json = readFile(inputPath)
  const parsedData = parseVORules(json, entities)
  const parsedJson = JSON.stringify(parsedData, null, 2)
  writeFile(outputPath, parsedJson)
}
