import { CleanVAState } from './cleanVoteAmericaData'
import { v1 } from './timeUtilities'
import { UsaState, usaStates } from './usaStates'
import { readFile, writeFile } from './utilities'

const { parseUsaDateToNaiveIsoDate } = v1

//-------//
// Types //
//-------//

// State types
//-------------

// The top-level index of all states and their parsed registration policy data.
export type ParsedVAStatesIndex = {
  [key: string]: ParsedVAStateRegPolicies
}

// An individual state's registration policies.
export type ParsedVAStateRegPolicies = {
  inPersonRegPolicies: Array<InPersonRegPolicy>
  mailRegPolicies: Array<MailRegPolicy>
  onlineRegPolicies: Array<OnlineRegPolicy>
}

// Policy types
//--------------

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
// Parsing methods //
//-----------------//

// Parse the JSON data for an individual state.
export function parseVAStateRegPolicies(
  cleanState: CleanVAState
): ParsedVAStateRegPolicies {
  const { inPerson, byMail, online } = cleanState

  const data = {
    inPersonRegPolicies: [],
    mailRegPolicies: [],
    onlineRegPolicies: [],
  }

  const naRegex = /N\/A/

  // InPerson
  //----------

  const inPersonRegex = /received by (\w+ \d{1,2}, \d{4})/
  const inPersonMatch = inPerson.match(inPersonRegex)

  // First, try to parse the date. Most states will succeed.
  let inPersonUsaDate
  let ipIsoDate
  try {
    inPersonUsaDate = inPersonMatch[1]
    ipIsoDate = parseUsaDateToNaiveIsoDate(inPersonUsaDate)
  } catch {
    // console.warn(`Could not parse inPerson: ${inPerson}`)
  }

  // If it worked, save it and continue.
  if (ipIsoDate) {
    data.inPersonRegPolicies.push({
      kind: 'InPersonRegDeadline',
      isoDate: ipIsoDate.toString(),
    })
  }

  // Otherwise, it could be not available, like ND.
  const ipNotAvailableMatch = inPerson.match(naRegex)
  if (ipNotAvailableMatch) {
    data.inPersonRegPolicies.push({ kind: 'InPersonRegNotAvailable' })
  }

  // Check that at least one of the above worked.
  if (!data.inPersonRegPolicies.length) {
    throw new Error(`Could not parse inPersonUsaDate: '${inPersonUsaDate}'`)
  }

  // Mail
  //----------

  const mailPostmarkedRegex = /postmarked by (\w+ \d{1,2}, \d{4})/
  const mailReceivedRegex = /received by (\w+ \d{1,2}, \d{4})/
  const mailPostmarkedMatch = byMail.match(mailPostmarkedRegex)
  const mailReceivedMatch = byMail.match(mailReceivedRegex)

  // First, try to parse the dates. Most states will succeed.
  let mailPostmarkedUsaDate
  let mailReceivedUsaDate
  let mailPostmarkedIsoDate
  let mailReceivedIsoDate
  try {
    mailPostmarkedUsaDate = mailPostmarkedMatch[1]
    mailPostmarkedIsoDate = parseUsaDateToNaiveIsoDate(mailPostmarkedUsaDate)
  } catch {
    // console.warn(
    //   `Could not parse mailPostmarkedUsaDate: ${mailPostmarkedUsaDate}`
    // )
  }
  try {
    mailReceivedUsaDate = mailReceivedMatch[1]
    mailReceivedIsoDate = parseUsaDateToNaiveIsoDate(mailReceivedUsaDate)
  } catch {
    // console.warn(`Could not parse mailReceivedUsaDate: ${mailReceivedUsaDate}`)
  }

  // If it worked, save it with the appropriate type and continue.
  if (mailPostmarkedIsoDate) {
    data.mailRegPolicies.push({
      kind: 'MailRegPostmarkedDeadline',
      isoDate: mailPostmarkedIsoDate.toString(),
    })
  }
  if (mailReceivedIsoDate) {
    data.mailRegPolicies.push({
      kind: 'MailRegReceivedDeadline',
      isoDate: mailReceivedIsoDate.toString(),
    })
  }

  // Otherwise, it could be ND or NH. Verify that it is and not an error first.
  const mailNotAvailableMatch = inPerson.match(naRegex)
  if (mailNotAvailableMatch) {
    data.mailRegPolicies.push({ kind: 'MailRegNotAvailable' })
  }

  // Check that at least one of the above worked. In theory a max of one should
  // work on this source data. We may be able to support multiple later.
  if (!data.mailRegPolicies.length) {
    throw new Error(`Could not parse byMail: '${byMail}'`)
  }

  // InPerson
  //----------

  const onlineRegex = /received by (\w+ \d{1,2}, \d{4})/
  const onlineMatch = online.match(onlineRegex)

  // First, try to parse the date. Most states will succeed.
  let onlineUsaDate
  let onlineIsoDate
  try {
    onlineUsaDate = onlineMatch[1]
    onlineIsoDate = parseUsaDateToNaiveIsoDate(onlineUsaDate)
  } catch {
    // console.warn(`Could not parse online: ${online}`)
  }

  // If it worked, save it and continue.
  if (onlineIsoDate) {
    data.onlineRegPolicies.push({
      kind: 'OnlineRegDeadline',
      isoDate: onlineIsoDate.toString(),
    })
  }

  // Otherwise, it could be not available, like ND.
  const onlineNotAvailableMatch = online.match(naRegex)
  if (onlineNotAvailableMatch) {
    data.onlineRegPolicies.push({ kind: 'OnlineRegNotAvailable' })
  }

  // Check that at least one of the above worked.
  if (!data.onlineRegPolicies.length) {
    throw new Error(`Could not parse onlineUsaDate: '${onlineUsaDate}'`)
  }

  return {
    inPersonRegPolicies: data.inPersonRegPolicies,
    mailRegPolicies: data.mailRegPolicies,
    onlineRegPolicies: data.onlineRegPolicies,
  }
}

// Parse the JSON data for all states.
export function parseVADeadlines(
  cleanJson: string,
  entities = usaStates
): ParsedVAStatesIndex {
  const cleanData = JSON.parse(cleanJson)

  const rulesetMap = entities.reduce(
    (memo: ParsedVAStatesIndex, state: UsaState): ParsedVAStatesIndex => {
      // Maybe it would've been good to do a cleanup step even though it barely
      // needed it (state.name vs. state.abbrev for example).
      const cleanedState: CleanVAState = cleanData[state.name]

      if (!cleanedState) {
        throw new Error(`Could not find state ${state.abbrev} in cleaned data.`)
      }

      console.log(state.abbrev)
      memo[state.abbrev] = parseVAStateRegPolicies(cleanedState)

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
export function readParseAndWriteVADeadlines(
  inputPath: string,
  outputPath: string,
  entities = usaStates
): void {
  const json = readFile(inputPath)
  const parsedData = parseVADeadlines(json, entities)
  const parsedJson = JSON.stringify(parsedData, null, 2)
  writeFile(outputPath, parsedJson)
}
