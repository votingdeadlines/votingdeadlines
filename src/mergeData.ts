import type {
  ParsedVAStatesIndex,
  ParsedVAStateRegPolicies,
} from './parseVoteAmericaDeadlines'
import type {
  ParsedVGStatesIndex,
  ParsedVGStateRegPolicies,
} from './parseVoteGovDeadlines'
import { UsaState, usaStatesAndDc } from './usaStates'
import { readFile, writeFile } from './utilities'

//-------//
// Types //
//-------//

// State types
//-------------

// The top-level index of all states and their parsed registration policy data.
export type MergedStatesIndex = {
  [key: string]: MergedStateRegPolicies
}

// An individual state's registration policies.
export type MergedStateRegPolicies = {
  stateAbbrev: string,
  stateName: string,
  inPersonRegPolicies: MergedInPersonRegPolicy
  mailRegPolicies: MergedMailRegPolicy
  onlineRegPolicies: MergedOnlineRegPolicy
  // sos
  // links
  // stateName
}

// Merged policies. For v0 let's try just merging the arrays and seeing if they
// are in agreement in the client.

// Policy types
//--------------

type MergedInPersonRegPolicy = {
  policies: Array<InPersonRegPolicy>
  warnings: Array<string>
}

type MergedMailRegPolicy = {
  policies: Array<MailRegPolicy>
  warnings: Array<string>
}

type MergedOnlineRegPolicy = {
  policies: Array<OnlineRegPolicy>
  warnings: Array<string>
}

// For now these are the same types as in ./parseVoteGovDeadlines. Hopefully
// they don't have to change and become V1 of the normalized universal types.

type InPersonRegPolicy = InPersonRegDeadline | InPersonRegNotAvailable

type InPersonRegDeadline = {
  kind: 'InPersonRegDeadline'
  isoDate: string
}

type InPersonRegNotAvailable = {
  // This is basically just ND, I think. Funtionally similar to same-day reg.
  kind: 'InPersonRegNotAvailable'
}

// This is an oversimplification in the source data, given that a number of
// states (IA, NY, MT, NE, NC, RI) have more complicated rules. See Vote.org.
type MailRegPolicy =
  | MailRegPostmarkedDeadline
  | MailRegReceivedDeadline
  | MailRegNotAvailable

type MailRegPostmarkedDeadline = {
  kind: 'MailRegPostmarkedDeadline'
  isoDate: string
}

type MailRegReceivedDeadline = {
  kind: 'MailRegReceivedDeadline'
  isoDate: string
}

type MailRegNotAvailable = {
  kind: 'MailRegNotAvailable'
}

type OnlineRegPolicy = OnlineRegDeadline | OnlineRegNotAvailable

type OnlineRegDeadline = {
  kind: 'OnlineRegDeadline'
  isoDate: string
}

type OnlineRegNotAvailable = {
  kind: 'OnlineRegNotAvailable'
}

//-----------------//
// Merge methods //
//-----------------//

type PremergeStatePolicies = {
  voteGovState: ParsedVGStateRegPolicies
  voteAmericaState: ParsedVAStateRegPolicies
}

// Merge an individual state.
function mergeStateRegPolicies(
  premergeStatePolicies: PremergeStatePolicies
): MergedStateRegPolicies {
  const { voteGovState, voteAmericaState } = premergeStatePolicies

  voteAmericaState // ignore for phase 0

  const mergedState = {
    stateAbbrev: voteGovState.stateAbbrev,
    stateName: voteGovState.stateName,
    inPersonRegPolicies: {
      policies: [
        ...voteGovState.inPersonRegPolicies, // add source? we lose
        // ...voteAmericaState.inPersonRegPolicies,
      ],
      warnings: ["Don't use this data until this warning is removed."],
    },
    mailRegPolicies: {
      policies: [
        ...voteGovState.mailRegPolicies,
        // ...voteAmericaState.mailRegPolicies,
      ],
      warnings: ["Don't use this data until this warning is removed."],
    },
    onlineRegPolicies: {
      policies: [
        ...voteGovState.onlineRegPolicies,
        // ...voteAmericaState.onlineRegPolicies
      ],
      warnings: ["Don't use this data until this warning is removed."],
    },
  }

  return mergedState
}

// Merge a collection of states.
function mergeVGAndVAData(
  vgJson: string,
  vaJson: string,
  entities = usaStatesAndDc
): MergedStatesIndex {
  const vgData: ParsedVGStatesIndex = JSON.parse(vgJson)
  const vaData: ParsedVAStatesIndex = JSON.parse(vaJson)

  const mergedData = entities.reduce(
    (
      memo: MergedStatesIndex,
      state: UsaState,
      i: number
    ): MergedStatesIndex => {
      const vgState: ParsedVGStateRegPolicies = vgData[state.abbrev]
      const vaState: ParsedVAStateRegPolicies = vaData[state.abbrev]

      console.log(`${'.'.repeat(i)}${state.abbrev}`)
      if (!vgState) {
        throw new Error(`Could not find state ${state.abbrev} in parsed data.`)
      }

      memo[state.abbrev] = mergeStateRegPolicies({
        voteGovState: vgState,
        voteAmericaState: vaState,
      })

      return memo
    },
    {}
  )

  return mergedData
}

//-----//
// I/O //
//-----//

// Reads cleaned JSON data, tries to parse it, and writes the result.
export function readMergeAndWriteVGAndVAData(
  vgPath: string,
  vaPath: string,
  outputPath: string,
  entities = usaStatesAndDc
): void {
  const vgJson = readFile(vgPath)
  const vaJson = readFile(vaPath)
  const mergedData = mergeVGAndVAData(vgJson, vaJson, entities)
  const mergedJson = JSON.stringify(mergedData, null, 2)
  writeFile(outputPath, mergedJson)
}
