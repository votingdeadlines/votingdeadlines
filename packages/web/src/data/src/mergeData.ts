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

    // AK:
    // Vote.gov seems to have the correct Alaska info (VoteAmerica notified):
    // https://www.elections.alaska.gov/Core/electiondatesandhours.php
    // VoteAmerica points out though that there is a presidential-only deadline.
    if ('AK' === abbrev) return vgPolicies

    // NV:
    // Nevada has slightly complex deadlines, in that in person registration
    // "ends" on October 6 for ordinary locations, but once early voting is
    // open, you can register and vote same-day at the polling place, up to
    // election day. So essentially you can register up until election day.
    if ('NV' === abbrev) return vaPolicies

    // RI:
    // Rhode Island could go be described either way, given that they close
    // most registration in October, but allow registrating to vote in the
    // presidential election until election day. For now, let's use Vote.gov.
    if ('RI' === abbrev) return vgPolicies

      // Moot discrepancies (the deadline is in the past either way)
    if ('FL' === abbrev) return vaPolicies

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
    // In VT, technically you can try to register online as late as election
    // day, but they may not have your name on the list and you may need to
    // re-register in person at the polls. As such it seems reasonable that
    // Vote.gov has VT's requested online deadline of "the Friday before", but
    // as it is more of a soft deadline let's go with VoteAmerica's 11-03.
    if ('VT' === abbrev) return vaPolicies

    // Vote.gov seems to be missing the DC online deadline. PR submitted.
    if ('DC' === abbrev) return vaPolicies

    // Moot discrepancies (the deadline is in the past either way)
    if ('FL' === abbrev) return vaPolicies

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

    // 1. ME:
    // VoteAmerica has what seems to be the correct deadline for Maine mail reg.
    // (Vote.gov seems to be out of date, using the original, pre-COVID date.)
    if ('ME' === abbrev) return vaPolicies

    // 2. AZ:
    // The case of Arizona is curious and currently being litigated by the SoS.
    // The sooner one registers, the better, because it is not perfectly clear
    // how the rules will be interpreted, or if they will be changed again.
    //
    // Normally, the registration date would be the following complex of rules:
    //   - ARS §16-120, Eligibility to vote:
    //     - https://www.azleg.gov/viewdocument/?docName=https://www.azleg.gov/ars/16/00120.htm
    //     - A. Must be registered before midnight, 29 days before election
    //     - B. If that's a weekend, the next business day works.
    //   - ARS $16-134, Return of voter registrations
    //     - https://www.azleg.gov/viewdocument/?docName=https://www.azleg.gov/ars/16/00134.htm
    //     - C.
    //       - 1. Must be postmarked >=29 days before an election and received
    //            by 7pm on election day
    //       - 2. Must be dated >=29 days before an election and received no
    //            more than 5 days late
    //
    // This is complex, but basically you should have your registration
    // _postmarked_ by the cutoff date, with about 5 days of wiggle room, and
    // if it doesn't arrive until after election day it won't count.
    //
    // This level of complexity seems absent from the ruling, which just says,
    // "accept all voter registrations received by 5pm on 10/23". It's unclear.
    // It might be more conservative to assume "received by 10/23", and more
    // optimistic to assume that "postmarked by 10/23" will be acceptable.
    //
    // The AZ SoS website says received by 5:00 pm, October 23
    //
    // Meanwhile, Vote.gov says:
    //   - received by Oct 23
    //   - previously said: postmarked by Oct 5
    //   - https://github.com/usagov/vote-gov/commit/43afe2120ffc7561dd7c563f2be451f6edc3e66c#diff-c6279079562d6e54a9bc3cc3b487ed5d49eab8d0200ddc6bb73a7ccce35f46c1
    // VoteAmerica:
    //   - postmarked by October 23, 2020
    //   - previously said: postmarked 29 days before election day
    //   - https://web.archive.org/web/20200803181736/https://www.voteamerica.com/register-to-vote-arizona/
    // 538: no info
    //   - "Register to vote by October 23"
    // Legal issues:
    //   - 2020-10-05: SoS Hobbs says will not appeal https://twitter.com/SecretaryHobbs/status/1313352717407006725
    //   - 2020-10-11: Hobs appeals https://ktar.com/story/3620036/arizona-secretary-of-state-hobbs-appeals-voter-registration-deadline/
    //
    // On balance, the Vote.gov data seems to the most likely to be correct,
    // although there is significant uncertainty. Let's keep using that data.
    if ('AZ' === abbrev) return vgPolicies

    // TODO: verify New Hampshire mail availability. It seems to be up to the
    // individual locality, so we may need a new type, e.g. 'ItsComplicated'.
    if ('NH' === abbrev) return vgPolicies

    // TODO: verify VT deadlines. It seems to be the case that VT is fuzzy,
    // in that there is no hard pre-Election Day deadline, but the Friday before
    // is recommended because if one's registration is not included on the list,
    // one will have to register at the polls in order to vote. Make a decision
    // and make it consistent between methods.
    if ('VT' === abbrev) return vgPolicies

    // VA:
    // The original date was 10/13. Due to a website crash, it was extended to
    // 10/15. Vote.gov seems to list this the most accurately.
    if ('VA' === abbrev) return vgPolicies

    // Moot discrepancies (the deadline is in the past either way)
    if ('AK' === abbrev) return vgPolicies
    if ('FL' === abbrev) return vaPolicies // correctly captures delay
    if ('GA' === abbrev) return vgPolicies
    if ('HI' === abbrev) return vgPolicies
    if ('ID' === abbrev) return vgPolicies
    if ('KY' === abbrev) return vgPolicies
    if ('RI' === abbrev) return vgPolicies

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
