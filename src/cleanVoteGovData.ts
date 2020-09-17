import { UsaState, usaStatesAndDc } from './usaStates'
import { logProgress, readFile, writeFile } from './utilities'

//-------//
// Types //
//-------//

// Raw types
//-----------

export type RawVGDataset = {
  [key: string]: RawVGState
}

// An individual state's data in the approximate format of the source JSON.
//
// This type is only loosely used by TypeScript at this time, but is included
// for documentation purposes. The cleaned types should be more useful.
export type RawVGState = {
  state_name: string
  state_abbreviation: string
  registration_type: string
  english: {
    crazyegg?: string // analytics
    registration_link?: string
    more_info_link: string
    ip_deadline?: string
    online_deadline?: string
    mail_deadline?: string // postmarked by
    mail_deadline2?: string // received by
  }
  spanish: {
    registration_link: string
    more_info_link: string
    registration_link_english_only?: string // boolean string
    more_info_link_english_only?: string // boolean string
    registration_link_spanish_selection?: string // a "select language" page
    more_info_link_spanish_selection?: string // a "select language" page
    ip_deadline: string
    online_deadline: string
    mail_deadline: string
  }
}

// Cleaned types
//---------------

export type CleanedVGDataset = {
  [key: string]: CleanedVGState
}

export type CleanedVGState = {
  // This field seems a bit overloaded. Look more into at the display phase.
  // Also, having trouble with union types, hence the `| string`. At a later
  // stage we could try importing the file instead of using readFile, and
  // dropping the `| string` for stricter typing.
  registrationType: 'online' | 'by-mail' | 'in-person' | 'not-needed' | string
  registrationLinks: {
    en?: string // seems optional
    es?: string
    englishOnly?: string
  }
  moreInfoLinks: {
    en: string // seems non-optional
    es?: string
    englishOnly?: string
  }
  ipDeadline: string
  bmDeadlines: {
    postmarkedBy: string
    receivedBy: string
  }
  olDeadline: string
}

//---------//
// Cleanup //
//---------//

export function cleanVGData(
  rawData: RawVGDataset,
  entities = usaStatesAndDc
): CleanedVGDataset {
  const cleanedData = entities.reduce(
    (memo: CleanedVGDataset, state: UsaState, i: number): CleanedVGDataset => {
      // The || is because the keys have an inconsistent format.
      const rawState = rawData[state.slug] || rawData[state.name]

      if (!rawState) {
        throw new Error(`Could not find state '${state.slug}' in raw data.`)
      }

      logProgress('Clean Vote.gov', state.abbrev, i)
      memo[state.abbrev] = cleanState(rawState)

      return memo
    },
    {}
  )

  return cleanedData
}

// Lightly cleans up the data for an individual state, e.g. dropping redundant
// info and labeling the mail-by data more clearly.
function cleanState(rawState: RawVGState): CleanedVGState {
  const { registration_type, english, spanish } = rawState
  const {
    registration_link_english_only,
    more_info_link_english_only,
  } = spanish

  const cleanedState: CleanedVGState = {
    registrationType: registration_type,
    registrationLinks: {
      en: english.registration_link,
      es: spanish.registration_link,
      englishOnly: registration_link_english_only,
    },
    moreInfoLinks: {
      en: english.more_info_link,
      es: spanish.more_info_link,
      englishOnly: more_info_link_english_only,
    },
    ipDeadline: english.ip_deadline,
    olDeadline: english.online_deadline,
    // They only seem to list one, though a state may have deadlines for both.
    bmDeadlines: {
      postmarkedBy: english.mail_deadline,
      receivedBy: english.mail_deadline2, // typo in Spanish Washington data
    },
  }

  return cleanedState
}

//-----//
// I/O //
//-----//

// Reads Vote.gov raw JSON data and writes a cleaned-up version.
export function readCleanAndWriteVGData(
  inputPath: string,
  outputPath: string,
  entities = usaStatesAndDc
): void {
  const rawJson = readFile(inputPath)
  const rawData: RawVGDataset = JSON.parse(rawJson)
  const cleanedData = cleanVGData(rawData, entities)
  const cleanedJson = JSON.stringify(cleanedData, null, 2)
  writeFile(outputPath, cleanedJson)
}
