// This is meant to clean up the raw JSON into something more usable.

import { CleanedVGState } from './cleanVoteGovData'
import { v1 } from './timeUtilities'
import { UsaState, usaStates } from './usaStates'
import { readFile, writeFile } from './utilities'

const { parseUsaLongDateToNaiveIsoDate } = v1

//-------//
// Types //
//-------//

// State types
//-------------

// The top-level index of all states and their parsed deadline data.
type VGStatesIndex = {
  [key: string]: VGStateRegPolicies
}

// An individual state's registration deadlines.
type VGStateRegPolicies = {
  inPersonRegPolicies: Array<InPersonRegPolicy>
  mailRegPolicies: Array<MailRegPolicy>
  onlineRegPolicies: Array<OnlineRegPolicy>
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

// "ipDeadline": "Monday, October 19, 2020",
// "olDeadline": "Monday, October 19, 2020",
// "bmDeadlines": {
//   "postmarkedBy": "Monday, October 19, 2020"
// }

//-----------------//
// Parsing methods //
//-----------------//

// Parse the JSON data for an individual state.
function parseVGStateRegPolicies(
  cleanedState: CleanedVGState
): VGStateRegPolicies {
  const { registrationType, ipDeadline, bmDeadlines, olDeadline } = cleanedState
  const { NOT_NEEDED, IN_PERSON, ONLINE } = REGISTRATION_TYPES
  // A few states don't have registration deadlines, at least in this data.
  const noRegistration = registrationType === NOT_NEEDED
  const noMailRegistration = [NOT_NEEDED, IN_PERSON].includes(registrationType)
  const noOnlineRegistration = registrationType !== ONLINE

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
    console.warn(`Could not parse ipDeadline: ${ipDeadline}`)
  }

  // If it worked, save it and continue.
  if (ipIsoDate) {
    data.inPersonRegPolicies.push({
      kind: 'InPersonRegDeadline',
      isoDate: ipIsoDate.toString(),
    })
  }

  // Otherwise, it could be ND. Verify that it is ND and not an error first.
  if (!ipIsoDate && noRegistration) {
    data.inPersonRegPolicies.push({ kind: 'InPersonRegNotAvailable' })
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

  // Otherwise, it could be ND or NH. Verify that it is and not an error first.
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
    console.warn(`Could not parse olDeadline: ${olDeadline}`)
  }

  // If it worked, save it and continue.
  if (onlineIsoDate) {
    data.onlineRegPolicies.push({
      kind: 'OnlineRegDeadline',
      isoDate: onlineIsoDate.toString(),
    })
  }

  // Otherwise, it is likely one of the several states that doesn't offer it.
  if (!onlineIsoDate && noOnlineRegistration) {
    data.onlineRegPolicies.push({ kind: 'OnlineRegNotAvailable' })
  }

  // Check that at least one of the above worked.
  if (!data.onlineRegPolicies.length) {
    throw new Error(`Could not parse olDeadline: '${olDeadline}'`)
  }

  const deadlines: VGStateRegPolicies = {
    inPersonRegPolicies: data.inPersonRegPolicies,
    mailRegPolicies: data.mailRegPolicies,
    onlineRegPolicies: data.onlineRegPolicies,
  }

  return deadlines
}

// Parse the JSON data for all states.
export function parseVORules(
  cleanedJson: string,
  entities = usaStates
): VGStatesIndex {
  const cleanedData = JSON.parse(cleanedJson)

  const rulesetMap = entities.reduce(
    (memo: VGStatesIndex, state: UsaState): VGStatesIndex => {
      const cleanedState: CleanedVGState = cleanedData[state.abbrev]

      if (!cleanedState) {
        throw new Error(`Could not find state ${state.abbrev} in cleaned data.`)
      }

      console.log(state.abbrev)
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
  entities = usaStates
): void {
  const json = readFile(inputPath)
  const parsedData = parseVORules(json, entities)
  const parsedJson = JSON.stringify(parsedData, null, 2)
  writeFile(outputPath, parsedJson)
}
