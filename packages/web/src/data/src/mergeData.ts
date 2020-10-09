import { strict as assert } from 'assert'

import type {
  ParsedVAStatesIndex,
  ParsedVAStateRegPolicies,
} from './voteamerica.com/parseVoteAmericaDeadlines'
import type {
  ParsedVGStateIndex,
  ParsedVGStateReg,
  RegNotNeeded,
} from './vote.gov/parseVoteGovDeadlines'
import { UsaState, usaStatesAndDc } from './usaStates'
import { logProgress, readFile, writeFile } from './utilities'

//-------//
// Types //
//-------//

// State types
//-------------

// The top-level index of all states and their parsed registration policy data.
export type MergedStateRegIndex = {
  [key: string]: MergedStateReg
}

// An individual state's registration policies.
export type MergedStateReg = {
  stateAbbrev: string
  stateName: string
  inPersonRegPolicies: MergedInPersonRegPolicy
  mailRegPolicies: MergedMailRegPolicy
  onlineRegPolicies: MergedOnlineRegPolicy
  registrationLinkEn: string | null
  moreInfoLinkEn: string | null
  checkRegStatusLink?: string | null
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

// A union of policy primitives, both dated and non-dated.
export type RegPolicy = InPersonRegPolicy | MailRegPolicy | OnlineRegPolicy

// A union of dated policy primitives.
export type RegDeadline =
  | InPersonRegDeadline
  | MailRegPostmarkedDeadline
  | MailRegReceivedDeadline
  | OnlineRegDeadline

// For now these are the same types as in ./parseVoteGovDeadlines. Hopefully
// they don't have to change and become V1 of the normalized universal types.

type InPersonRegPolicy =
  | InPersonRegDeadline
  | InPersonRegNotAvailable
  | RegNotNeeded

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
  | RegNotNeeded

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

type OnlineRegPolicy = OnlineRegDeadline | OnlineRegNotAvailable | RegNotNeeded

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
  voteGovState: ParsedVGStateReg
  voteAmericaState: ParsedVAStateRegPolicies
}

// Merge the data of an individual state. Give that Vote.gov's seems pretty
// accurate now, we mostly defer to that but expect VoteAmerica's data to be
// the same, or to be a known special case (e.g. RI is a special case, where
// there is a main deadline and then a later presidential-only deadline).
function mergeStateRegPolicies(
  premergeStatePolicies: PremergeStatePolicies
): MergedStateReg {
  const { voteGovState, voteAmericaState } = premergeStatePolicies

  function _mergeInPersonRegPolicies(
    abbrev: string,
    vgPolicies: Array<InPersonRegPolicy>,
    vaPolicies: Array<InPersonRegPolicy>
  ): Array<InPersonRegPolicy> {
    // The terminology is a bit confusing (TODO: standardize parsed vs. merged).
    // Here "policies" means the inner policy arrays, which are more similar
    // between VG and VA. (The outer/parent policy object has more keys in VG.)

    // First, let's handle known discrepancies.
    // Vote.gov seems to have the correct Alaska info (VoteAmerica notified):
    // https://www.elections.alaska.gov/Core/electiondatesandhours.php
    if ('AK' === abbrev) return vgPolicies
    // VoteAmerica seems to have the delayed (now moot) Florida deadline.
    if ('FL' === abbrev) return vaPolicies
    // Nevada has slightly complex deadlines, in that in person registration
    // "ends" on October 6 for ordinary locations, but once early voting is
    // open, you can register and vote same-day at the polling place, up to
    // election day. So essentially you can register up until election day.
    if ('NV' === abbrev) return vaPolicies
    // Rhode Island could go be described either way, given that they close
    // most registration in October, but allow registrating to vote in the
    // presidential election until election day. For now, let's use Vote.gov.
    if ('RI' === abbrev) return vgPolicies

    // Otherwise assert that they should be equal.
    assert.deepStrictEqual(vgPolicies, vaPolicies)

    // Assuming that was true, return one of them.
    return vgPolicies
  }

  // Same as the previous function, but for online policies.
  // (It might be more concise to handle all methods at once, but it seems to
  // be causing TypeScript headaches to try to make these methods generic.)
  function _mergeOnlinePolicies(
    abbrev: string,
    vgPolicies: Array<OnlineRegPolicy>,
    vaPolicies: Array<OnlineRegPolicy>
  ): Array<OnlineRegPolicy> {
    // See comments on the in person method above.
    if ('FL' === abbrev) return vaPolicies
    // In VT, technically you can try to register online as late as election
    // day, but they may not have your name on the list and you may need to
    // re-register in person at the polls. As such it seems reasonable that
    // Vote.gov has VT's requested online deadline of "the Friday before", but
    // as it is more of a soft deadline let's go with VoteAmerica's 11-03.
    if ('VT' === abbrev) return vaPolicies
    // Vote.gov seems to be missing the DC online deadline.
    if ('DC' === abbrev) return vaPolicies

    // Otherwise assert that they should be equal.
    assert.deepStrictEqual(vgPolicies, vaPolicies)

    // Assuming that was true, return one of them.
    return vgPolicies
  }

  // Same as the previous functions, but for mail policies.
  function _mergeMailRegPolicies(
    abbrev: string,
    vgPolicies: Array<MailRegPolicy>,
    vaPolicies: Array<MailRegPolicy>
  ): Array<MailRegPolicy> {
    // First, let's handle known discrepancies.
    // Vote.gov seems to have the correct Alaska info (VoteAmerica notified):
    // https://www.elections.alaska.gov/Core/electiondatesandhours.php
    if ('AK' === abbrev) return vgPolicies
    // TODO: verify Arizona postmarked vs. received
    if ('AZ' === abbrev) return vgPolicies
    // See comments on the in person method above.
    if ('FL' === abbrev) return vaPolicies
    // TODO: verify Georgia postmarked vs. received
    if ('GA' === abbrev) return vgPolicies
    // TODO: verify Hawaii postmarked vs. received
    if ('HI' === abbrev) return vgPolicies
    // TODO: verify Idaho postmarked vs. received
    if ('ID' === abbrev) return vgPolicies
    // TODO: verify Kentucky postmarked vs. received
    if ('KY' === abbrev) return vgPolicies
    // TODO: verify Maine deadline
    if ('ME' === abbrev) return vgPolicies
    // TODO: verify New Hampshire mail availability
    if ('NH' === abbrev) return vgPolicies
    // TODO: verify RI deadline
    if ('RI' === abbrev) return vgPolicies
    // TODO: verify VT deadline
    if ('VT' === abbrev) return vgPolicies

    // Otherwise assert that they should be equal.
    assert.deepStrictEqual(vgPolicies, vaPolicies)

    // Assuming that was true, return one of them.
    return vgPolicies
  }

  const mergedState = {
    stateAbbrev: voteGovState.stateAbbrev,
    stateName: voteGovState.stateName,
    inPersonRegPolicies: {
      policies: _mergeInPersonRegPolicies(
        voteGovState.stateAbbrev,
        voteGovState.inPersonRegPolicies,
        voteAmericaState.inPersonRegPolicies,
      ),
      warnings: [],
    },
    mailRegPolicies: {
      policies: _mergeMailRegPolicies(
        voteGovState.stateAbbrev,
        voteGovState.mailRegPolicies,
        voteAmericaState.mailRegPolicies,
      ),
      warnings: [],
    },
    onlineRegPolicies: {
      policies: _mergeOnlinePolicies(
        voteGovState.stateAbbrev,
        voteGovState.onlineRegPolicies,
        voteAmericaState.onlineRegPolicies
      ),
      warnings: [],
    },
    registrationLinkEn: voteGovState.registrationLinkEn,
    moreInfoLinkEn: voteGovState.moreInfoLinkEn,
  }

  return mergedState
}

// Merge a collection of states.
function mergeVGAndVAData(
  vgJson: string,
  vaJson: string,
  entities = usaStatesAndDc
): MergedStateRegIndex {
  const vgData: ParsedVGStateIndex = JSON.parse(vgJson)
  const vaData: ParsedVAStatesIndex = JSON.parse(vaJson)

  const mergedData = entities.reduce(
    (
      memo: MergedStateRegIndex,
      state: UsaState,
      i: number
    ): MergedStateRegIndex => {
      const vgState: ParsedVGStateReg = vgData[state.abbrev]
      const vaState: ParsedVAStateRegPolicies = vaData[state.abbrev]

      logProgress('Merge data:', state.abbrev, i)

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
