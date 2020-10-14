// This is meant to clean up the raw JSON into something more usable.

import type { CleanedVGState } from './cleanVoteGovData'
import { v1 } from '../timeUtilities'
import { UsaState, usaStatesAndDc } from '../usaStates'
import { logProgress, readFile, writeFile } from '../utilities'

const { parseUsaLongDateToNaiveIsoDate } = v1

//-------//
// Types //
//-------//

// State types
//-------------

// The top-level index of all states and their parsed deadline data.
export type ParsedVGStateIndex = {
  [key: string]: ParsedVGStateReg
}

// An individual state's registration deadlines.
export type ParsedVGStateReg = {
  stateAbbrev: string
  stateName: string
  inPersonRegPolicies: Array<InPersonRegPolicy>
  mailRegPolicies: Array<MailRegPolicy>
  onlineRegPolicies: Array<OnlineRegPolicy>
  registrationLinkEn: string | null
  moreInfoLinkEn: string | null
}

// Deadline types
//----------------

// These values are present in the source data, but don't make total sense.
const REGISTRATION_TYPES = {
  BY_MAIL: 'by-mail', // indicates a state does not have online reg
  NOT_NEEDED: 'not-needed', // used to validate we're looking at ND
  ONLINE: 'online', // indicates a state supports online registration
  IN_PERSON: 'in-person', // present on NH, though that seems inaccurate
}

// This type is currently just applicable to North Dakota, where you may vote
// if you can prove residency, and there is no separate registration process.
export type RegNotNeeded = {
  kind: 'RegNotNeeded'
  isoDate: string // It is convenient to consider Election Day the "deadline".
}

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
// Parsing methods //
//-----------------//

function getRegNotNeededPolicy(): RegNotNeeded {
  const ELECTION_DATE = '2020-11-03' // effective deadline for voting
  return { kind: 'RegNotNeeded', isoDate: ELECTION_DATE }
}

// Parse the JSON data for an individual state.
function parseVGStateRegPolicies(cleaned: CleanedVGState): ParsedVGStateReg {
  const {
    stateAbbrev,
    stateName,
    registrationType,
    ipDeadline,
    bmDeadlines,
    olDeadline,
    registrationLinks,
    moreInfoLinks,
  } = cleaned
  const { NOT_NEEDED, IN_PERSON, ONLINE } = REGISTRATION_TYPES

  // A few states don't have registration deadlines, at least in this data.
  const regNotNeeded = registrationType === NOT_NEEDED
  const noMailRegistration = [NOT_NEEDED, IN_PERSON].includes(registrationType)
  const noOnlineRegistration = registrationType !== ONLINE // unreliable in data

  const data = {
    inPersonRegPolicies: [],
    mailRegPolicies: [],
    onlineRegPolicies: [],
  }

  // InPerson
  //----------

  // First, try to parse the date. Most states will succeed.
  let ipIsoDate
  try {
    ipIsoDate = parseUsaLongDateToNaiveIsoDate(ipDeadline)
  } catch {
    // console.warn(`Could not parse ipDeadline: ${ipDeadline}`)
  }

  // If it worked, save it and continue.
  if (ipIsoDate) {
    data.inPersonRegPolicies.push({
      kind: 'InPersonRegDeadline',
      isoDate: ipIsoDate.toString(),
    })
  }

  // Otherwise, it could be ND. Verify that it is ND and not an error first.
  if (!ipIsoDate && regNotNeeded) {
    data.inPersonRegPolicies.push(getRegNotNeededPolicy())
  }

  // Check that at least one of the above worked.
  if (!data.inPersonRegPolicies.length) {
    throw new Error(`Could not parse ipDeadline: '${ipDeadline}'`)
  }

  // Mail
  //------

  // First, try to parse whichever date is included, ignoring the type for now.
  const { postmarkedBy, receivedBy } = bmDeadlines
  let postmarkedByIsoDate
  try {
    postmarkedByIsoDate = parseUsaLongDateToNaiveIsoDate(postmarkedBy)
  } catch {
    // console.info(`Could not parse postmarkedBy: ${postmarkedBy}`)
  }
  let receivedByIsoDate
  try {
    receivedByIsoDate = parseUsaLongDateToNaiveIsoDate(receivedBy)
  } catch {
    // console.info(`Could not parse receivedBy: ${receivedBy}`)
  }

  // If it worked, save it with the appropriate type and continue.
  if (postmarkedByIsoDate) {
    data.mailRegPolicies.push({
      kind: 'MailRegPostmarkedDeadline',
      isoDate: postmarkedByIsoDate.toString(),
    })
  }
  if (receivedByIsoDate) {
    data.mailRegPolicies.push({
      kind: 'MailRegReceivedDeadline',
      isoDate: receivedByIsoDate.toString(),
    })
  }

  // Otherwise, it could be ND or NH.
  if (!data.mailRegPolicies.length && regNotNeeded) {
    data.mailRegPolicies.push(getRegNotNeededPolicy())
  }
  if (!data.mailRegPolicies.length && noMailRegistration) {
    data.mailRegPolicies.push({ kind: 'MailRegNotAvailable' })
  }

  // Check that at least one of the above worked. In theory a max of one should
  // work on this source data. We may be able to support multiple later.
  if (!data.mailRegPolicies.length) {
    throw new Error(`Could not parse bmDeadlines: '${bmDeadlines}'`)
  }

  // Online
  //----------

  // First, try to parse the date. Most states will succeed.
  let onlineIsoDate
  try {
    onlineIsoDate = parseUsaLongDateToNaiveIsoDate(olDeadline)
  } catch {
    // console.warn(`Could not parse olDeadline for ${stateAbbrev}: ${olDeadline}`)
  }

  // If it worked, save it and continue.
  if (onlineIsoDate) {
    data.onlineRegPolicies.push({
      kind: 'OnlineRegDeadline',
      isoDate: onlineIsoDate.toString(),
    })
  }

  // Otherwise, it is likely one of the several states that doesn't offer it.
  if (!data.onlineRegPolicies.length && regNotNeeded) {
    data.onlineRegPolicies.push(getRegNotNeededPolicy())
  }
  if (!data.onlineRegPolicies.length && noOnlineRegistration) {
    data.onlineRegPolicies.push({ kind: 'OnlineRegNotAvailable' })
  }

  // Check that at least one of the above worked.
  // This check successfully noticed an omission in the Vote.gov data, where
  // DC was listed as an "online" state and with a registration URL, but
  // without an online deadline. To prevent this known error from stopping
  // the entire pipeline, we allow it here, but similar mistakes should
  // still be investigated. (DC should get fixed when we merge in VoteAmerica
  // data, or we can do a manual correction.)
  const isAllowableOlError = ['DC'].includes(stateAbbrev)
  const onlineError = !data.onlineRegPolicies.length && !isAllowableOlError
  if (onlineError) {
    const msg = `Could not parse olDeadline for ${stateAbbrev}: ${olDeadline}`
    throw new Error(msg)
  }

  // Links
  //-------

  const registrationLinkEn = (registrationLinks && registrationLinks.en) || null
  const isRegLinkMissing = !registrationLinkEn && !noOnlineRegistration
  if (isRegLinkMissing) {
    throw new Error(`Online reg link seems to be missing for ${stateAbbrev}`)
  }
  const moreInfoLinkEn = (moreInfoLinks && moreInfoLinks.en) || null
  if (!moreInfoLinkEn) {
    throw new Error(`More info link seems to be missing for ${stateAbbrev}`)
  }

  const parsedData: ParsedVGStateReg = {
    stateAbbrev,
    stateName,
    inPersonRegPolicies: data.inPersonRegPolicies,
    mailRegPolicies: data.mailRegPolicies,
    onlineRegPolicies: data.onlineRegPolicies,
    registrationLinkEn,
    moreInfoLinkEn,
  }

  return parsedData
}

// Parse the JSON data for all states.
export function parseVORules(
  cleanedJson: string,
  entities = usaStatesAndDc
): ParsedVGStateIndex {
  const cleanedData = JSON.parse(cleanedJson)

  const rulesetMap = entities.reduce(
    (memo: ParsedVGStateIndex, state: UsaState, i): ParsedVGStateIndex => {
      const cleanedState: CleanedVGState = cleanedData[state.abbrev]

      if (!cleanedState) {
        throw new Error(`Could not find state ${state.abbrev} in cleaned data.`)
      }

      logProgress('Parse Vote.gov:', state.abbrev, i)
      memo[state.abbrev] = parseVGStateRegPolicies(cleanedState)

      return memo
    },
    {}
  )

  return rulesetMap
}

//-----//
// I/O //
//-----//

// Reads cleaned JSON data, tries to parse it, and writes the result.
export function readParseAndWriteVGDeadlines(
  inputPath: string,
  outputPath: string,
  entities = usaStatesAndDc
): void {
  const json = readFile(inputPath)
  const parsedData = parseVORules(json, entities)
  const parsedJson = JSON.stringify(parsedData, null, 2)
  writeFile(outputPath, parsedJson)
}
