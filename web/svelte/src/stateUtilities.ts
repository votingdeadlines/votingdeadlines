// Utilities that are mostly about working with state data types, e.g.
// ClientStateData or MergedStateData. The Svelte components shouldn't need to
// know much about that data structure.

import type {
  ClientStateData,
  ClientOnlineRegPolicy,
  ClientInPersonRegPolicy,
  ClientMailRegPolicy
 } from './clientTypes'
import { DurationV2, v2 } from './clientTimeUtilities'
import { mainStateTimezones } from './stateTzs'

const { dayjs, formatDateFromIsoDate, getDuration, now, isoDateDisplay } = v2

//-------//
// Types //
//-------//

// These are the high-level kinds of UI we should show, depending on the data.
// Possibly we can DRY them later if they haven't evolved differently.

enum OnlineUiKind {
  Countdown = 'Countdown',
  NotAvailable = 'NotAvailable',
  Unsure = 'Unsure', // 🤔 bad data
  Bug = 'Bug', // ⚠️ runtime bug
}

type OnlineUiBooleans = {
  isCountdown: boolean
  isNotAvailable: boolean
  isUnsure: boolean
  isBug: boolean
}

enum InPersonUiKind {
  Countdown = 'Countdown',
  NotAvailable = 'NotAvailable',
  Unsure = 'Unsure', // 🤔 bad data
  Bug = 'Bug', // ⚠️ runtime bug
}

type InPersonUiBooleans = {
  isCountdown: boolean
  isNotAvailable: boolean
  isUnsure: boolean
  isBug: boolean
}

enum MailUiKind {
  // Multiple countdown types!
  PostmarkedCountdown = 'PostmarkedCountdown',
  ReceivedCountdown = 'ReceivedCountdown',
  // Later we may want to support showing both for states that require both!
  // DualCountdowns = 'DualCountdowns',
  NotAvailable = 'NotAvailable',
  Unsure = 'Unsure', // 🤔 bad data
  Bug = 'Bug', // ⚠️ runtime bug
}

type MailUiBooleans = {
  isPostmarkedCountdown: boolean
  isReceivedCountdown: boolean
  isNotAvailable: boolean
  isUnsure: boolean
  isBug: boolean
}

//---------//
// Methods //
//---------//

// We may be able to DRY these later, but the logic is already different for
// mail, and it's possible online/in person may evolve a bit differently too.

//-----------------//
// Methods: Online //
//-----------------//

// Package the UI kind into booleans so the components need less logic.
export function getOnlineUiBooleans(
  stateData: ClientStateData
): OnlineUiBooleans {
  const onlineUiKind = getOnlineUiKind(stateData)
  return {
    isCountdown: onlineUiKind === OnlineUiKind.Countdown,
    isNotAvailable: onlineUiKind === OnlineUiKind.NotAvailable,
    isUnsure: onlineUiKind === OnlineUiKind.Unsure,
    isBug: onlineUiKind === OnlineUiKind.Bug,
  }
}

// Figure out which of the above kinds of UI we should display.
function getOnlineUiKind(stateData: ClientStateData): OnlineUiKind {
  try {
    const onlineIsAvailable = getIsOnlineRegAvailable(stateData)
    if (onlineIsAvailable) return OnlineUiKind.Countdown
    if (onlineIsAvailable === false) return OnlineUiKind.NotAvailable
    if (onlineIsAvailable === null) return OnlineUiKind.Unsure
  } catch (e) {
    const errorMessage = `Unexpected error while trying to determine online UI.`
    console.warn(errorMessage, e, stateData)
  }
  return OnlineUiKind.Bug
}

// This function does the core work to figure out which of the above kinds of
// UI we can display. How to interpret the return values:
//
// - true  == we know it's available (at least, according to the first policy).
// - false == we know it's unavilable (at least, according to the first policy).
// - null  == we can't resolve either of the cases above (e.g. no policy found).
export function getIsOnlineRegAvailable(stateData: ClientStateData): boolean | null {
  const firstOnlinePolicy: ClientOnlineRegPolicy | null =
    getFirstOnlineRegPolicy(stateData)

  if (!firstOnlinePolicy) return null
  const isAvailable = firstOnlinePolicy.kind === 'OnlineRegDeadline'
  const isUnavailable = firstOnlinePolicy.kind === 'OnlineRegNotAvailable'
  if (isAvailable) return true
  if (isUnavailable) return false
  return null
}

// Get the first online registration policy we have. Later we can check for >1.
function getFirstOnlineRegPolicy(stateData: ClientStateData): ClientOnlineRegPolicy | null {
  let firstOnlinePolicy: ClientOnlineRegPolicy | undefined

  try {
    firstOnlinePolicy = stateData.onlineRegPolicies.policies[0]
  } catch (e) {
    console.warn(`Error trying to get online policy.`, e)
    console.warn(stateData.onlineRegPolicies.policies)
  }

  return firstOnlinePolicy ? firstOnlinePolicy : null
}

// Get the likely online deadline, for display as a countdown later.
function getFirstOnlineRegDeadline(stateData: ClientStateData): string | null {
  // We have to gate getting .isoDate behind these checks to keep TS happy.
  // In theory checking isAvailable should make checking the .kind unnecessary,
  // but in practice that doesn't seem to be working.
  const firstOnlineRegPolicy = getFirstOnlineRegPolicy(stateData)
  if (!firstOnlineRegPolicy) return null
  if (firstOnlineRegPolicy.kind !== 'OnlineRegDeadline') return null
  return firstOnlineRegPolicy.isoDate
}

// Online UI dates

// This is an object that has all the various dates/times needed in the UI.
// Probably easier than calling a bunch of individual functions separately.
type OnlineDeadlineUiDates = {
  mainDeadlineDisplay: string,
  mainCountdown: DurationV2,
  currentBrowserTimeDisplay: string, // 2020-09-24 09:00 (UTC-7:00)
  currentStateTimeDisplay: string, // 2020-09-24 08:00 (UTC-8:00)
  startOfFinalDayStateTimeDisplay: string, // 2020-10-04 00:00 (UTC-8:00)
  stateDiffString: string, // '0 days + 00:00:00', from mainCountdown
}

export function getOnlineDeadlineUiDates(stateData: ClientStateData, timeNow): OnlineDeadlineUiDates | null {
  const isoDeadline = getFirstOnlineRegDeadline(stateData)
  if (!isoDeadline) {
    // Should never get here if we only call this in the right cases.
    // throw new Error('Could not find online deadline in state data.', stateData)
    return null
  }

  // 1. mainDeadlineDisplay: Monday, October 5, 2020
  const mainDeadlineDisplay = formatDateFromIsoDate(isoDeadline)

  // 2. Your current time:
  const currentBrowserTime = timeNow // guesses tz from Intl
  const currentBrowserTimeDisplay = isoDateDisplay(currentBrowserTime)

  // 3. Current state time: [hardcode for this pass]
  const stateTz = getMainStateTimezone(stateData.stateAbbrev)
  const currentStateTime = dayjs.tz(currentBrowserTime, stateTz)
  const currentStateTimeDisplay = isoDateDisplay(currentStateTime)

  // 4. Start of final day, state time:
  const startOfFinalDay = `${isoDeadline}T00:00:00`
  const startOfFinalDayStateTime = dayjs.tz(startOfFinalDay, stateTz)
  const startOfFinalDayStateTimeDisplay = isoDateDisplay(startOfFinalDayStateTime)

  // 5. Countdown until start of final day (future, present)
  const mainCountdown = getDuration(startOfFinalDayStateTime, currentStateTime)

  const dates = {
    mainCountdown,
    mainDeadlineDisplay,
    currentBrowserTimeDisplay, // 2020-09-24 09:00 (UTC-7:00)
    currentStateTimeDisplay, // 2020-09-24 08:00 (UTC-8:00)
    startOfFinalDayStateTimeDisplay, // 2020-10-04 00:00 (UTC-8:00)
  }

  return dates
}

//--------------------//
// Methods: In Person //
//--------------------//

// x Mail hass DIFFERENT return types
// Package the UI kind into booleans so the components need less logic.
export function getInPersonUiBooleans(
  stateData: ClientStateData
): InPersonUiBooleans {
  const inPersonUiKind = getInPersonUiKind(stateData)
  return {
    isCountdown: inPersonUiKind === InPersonUiKind.Countdown,
    isNotAvailable: inPersonUiKind === InPersonUiKind.NotAvailable,
    isUnsure: inPersonUiKind === InPersonUiKind.Unsure,
    isBug: inPersonUiKind === InPersonUiKind.Bug,
  }
}

// x Mail hass DIFFERENT return types
// Figure out which of the above kinds of UI we should display.
function getInPersonUiKind(stateData: ClientStateData): InPersonUiKind {
  try {
    const inPersonIsAvailable = getIsInPersonRegAvailable(stateData)
    if (inPersonIsAvailable) return InPersonUiKind.Countdown
    if (inPersonIsAvailable === false) return InPersonUiKind.NotAvailable
    if (inPersonIsAvailable === null) return InPersonUiKind.Unsure
  } catch (e) {
    const errorMessage = `Unexpected error while trying to determine in person UI.`
    console.warn(errorMessage, e, stateData)
  }
  return InPersonUiKind.Bug
}

// x NOT USED BY MAIL (mail uses `getMailRegPolicies`, in more detail)
// This function does the core work to figure out which of the above kinds of
// UI we can display. How to interpret the return values:
//
// - true  == we know it's available (at least, according to the first policy).
// - false == we know it's unavilable (at least, according to the first policy).
// - null  == we can't resolve either of the cases above (e.g. no policy found).
export function getIsInPersonRegAvailable(stateData: ClientStateData): boolean | null {
  const firstInPersonPolicy: ClientInPersonRegPolicy | null =
    getFirstInPersonRegPolicy(stateData)

  if (!firstInPersonPolicy) return null
  const isAvailable = firstInPersonPolicy.kind === 'InPersonRegDeadline'
  const isUnavailable = firstInPersonPolicy.kind === 'InPersonRegNotAvailable'
  if (isAvailable) return true
  if (isUnavailable) return false
  return null
}

// x NOT USED BY MAIL (mail uses `getMailRegPolicies`)
// Get the first in person registration policy we have. Later we can check for >1.
function getFirstInPersonRegPolicy(stateData: ClientStateData): ClientInPersonRegPolicy | null {
  let firstInPersonPolicy: ClientInPersonRegPolicy | undefined

  try {
    firstInPersonPolicy = stateData.inPersonRegPolicies.policies[0]
  } catch (e) {
    console.warn(`Error trying to get in person policy.`, e)
    console.warn(stateData.inPersonRegPolicies.policies)
  }

  return firstInPersonPolicy ? firstInPersonPolicy : null
}

// x NOT USED BY MAIL (mail uses `getMailRegPolicies`)
// Get the likely in person deadline, for display as a countdown later.
function getFirstInPersonRegDeadline(stateData: ClientStateData): string | null {
  // We have to gate getting .isoDate behind these checks to keep TS happy.
  // In theory checking isAvailable should make checking the .kind unnecessary,
  // but in practice that doesn't seem to be working.
  const firstInPersonRegPolicy = getFirstInPersonRegPolicy(stateData)
  if (!firstInPersonRegPolicy) return null
  if (firstInPersonRegPolicy.kind !== 'InPersonRegDeadline') return null
  return firstInPersonRegPolicy.isoDate
}

// In person UI dates

// This is an object that has all the various dates/times needed in the UI.
// Probably easier than calling a bunch of individual functions separately.
type InPersonDeadlineUiDates = {
  mainDeadlineDisplay: string,
  mainCountdown: DurationV2,
  currentBrowserTimeDisplay: string, // 2020-09-24 09:00 (UTC-7:00)
  currentStateTimeDisplay: string, // 2020-09-24 08:00 (UTC-8:00)
  startOfFinalDayStateTimeDisplay: string, // 2020-10-04 00:00 (UTC-8:00)
  stateDiffString: string, // '0 days + 00:00:00', from mainCountdown
}

export function getInPersonDeadlineUiDates(stateData: ClientStateData, timeNow): InPersonDeadlineUiDates | null {
  const isoDeadline = getFirstInPersonRegDeadline(stateData)
  if (!isoDeadline) {
    // Should never get here if we only call this in the right cases.
    // throw new Error('Could not find in person deadline in state data.', stateData)
    return null
  }

  // 1. mainDeadlineDisplay: Monday, October 5, 2020
  const mainDeadlineDisplay = formatDateFromIsoDate(isoDeadline)

  // 2. Your current time:
  const currentBrowserTime = timeNow // guesses tz from Intl
  const currentBrowserTimeDisplay = isoDateDisplay(currentBrowserTime)

  // 3. Current [Alaska] time: [hardcode for this pass]
  const stateTz = getMainStateTimezone(stateData.stateAbbrev)
  const currentStateTime = dayjs.tz(currentBrowserTime, stateTz)
  const currentStateTimeDisplay = isoDateDisplay(currentStateTime)

  // 4. Start of final day, in [Alaska] Time:
  const startOfFinalDay = `${isoDeadline}T00:00:00`
  const startOfFinalDayStateTime = dayjs.tz(startOfFinalDay, stateTz)
  const startOfFinalDayStateTimeDisplay = isoDateDisplay(startOfFinalDayStateTime)

  // 5. Countdown until start of final day (future, present)
  const mainCountdown = getDuration(startOfFinalDayStateTime, currentStateTime)

  const dates = {
    mainCountdown,
    mainDeadlineDisplay,
    currentBrowserTimeDisplay, // 2020-09-24 09:00 (UTC-7:00)
    currentStateTimeDisplay, // 2020-09-24 08:00 (UTC-8:00)
    startOfFinalDayStateTimeDisplay, // 2020-10-04 00:00 (UTC-8:00)
  }

  return dates
}

//---------------//
// Methods: Mail //
//---------------//

// x DIFFERENT return types
// Package the UI kind into booleans so the components need less logic.
export function getMailUiBooleans(
  stateData: ClientStateData
): MailUiBooleans {
  const mailUiKind = getMailUiKind(stateData)
  return {
    isPostmarkedCountdown: mailUiKind === MailUiKind.PostmarkedCountdown,
    isReceivedCountdown: mailUiKind === MailUiKind.ReceivedCountdown,
    isNotAvailable: mailUiKind === MailUiKind.NotAvailable,
    isUnsure: mailUiKind === MailUiKind.Unsure,
    isBug: mailUiKind === MailUiKind.Bug,
  }
}

// x DIFFERENT return types and does more inline
// The other methods (online/in person) break some of the similar logic out;
// we might want to do that as we do the dates function.
// Figure out which of the above kinds of UI we should display.
function getMailUiKind(stateData: ClientStateData): MailUiKind {
  try {
    const policies = getMailRegPolicies(stateData)

    // If there are no mail policies found, something is up with the data:
    const noPolicies = !policies || !policies.length
    if (noPolicies) return MailUiKind.Unsure

    // If there are multiple policies, we don't really support that yet, though
    // we may try later, given some states have multiple mail deadlines.
    // i.e. `if (twoPolicies) return MailUiKind.DualCountdowns`
    const singlePolicy = policies.length === 1
    if (!singlePolicy) return MailUiKind.Unsure

    // Assume a single mail policy from here down.
    const policy = policies[0]

    // If it's a postmarked-by state, show that UI.
    const policyIsPostmarked = policy.kind === 'MailRegPostmarkedDeadline'
    if (policyIsPostmarked) return MailUiKind.PostmarkedCountdown

    // If it's a received-by state, show that UI.
    const policyIsReceived = policy.kind === 'MailRegReceivedDeadline'
    if (policyIsReceived) return MailUiKind.ReceivedCountdown

    // If it's a state that doesn't support mail registration, show that UI.
    const policyIsNotAvailable = policy.kind === 'MailRegNotAvailable'
    if (policyIsNotAvailable) return MailUiKind.NotAvailable
  } catch (e) {
    const errorMessage = `Unexpected error while trying to get mail UI.`
    console.warn(errorMessage, e, stateData)
  }

  // If anything threw, or we somehow failed to return, show the bug UI.
  return MailUiKind.Bug
}

// Initially we didn't have this but it seems we need it.
export function getIsMailRegAvailable(stateData: ClientStateData): boolean | null {
  const mailPolicies: Array<ClientMailRegPolicy> = getMailRegPolicies(stateData)

  // If we've made a mistake with the data structure (e.g. backend changes):
  if (!mailPolicies) return null
  // If for some reason it's empty (e.g. backend changes, data source changes):
  if (!mailPolicies.length) return null

  const firstPolicy = mailPolicies[0]
  const availables = ['MailRegPostmarkedDeadline', 'MailRegReceivedDeadline']
  const isAvailable = availables.includes(firstPolicy.kind)
  return isAvailable
}

// ! UNIQUE TO MAIL
// This is an alternative to `getIsFooRegAvailable` (used by online/in person),
// because it's not as simple as a boolean with mail – we nee to know what type
// of mail deadline it is. Called by `getMailUiKind` to determine the UI.
function getMailRegPolicies(stateData: ClientStateData): Array<ClientMailRegPolicy> | null {
  let mailPolicies: Array<ClientMailRegPolicy> | undefined

  try {
    mailPolicies = stateData.mailRegPolicies.policies
  } catch (e) {
    console.warn(`Error trying to get mail policies.`, e)
    console.warn(stateData.mailRegPolicies)
  }

  // If we've made a mistake with the data structure (e.g. backend changes):
  if (!mailPolicies) return null
  // If for some reason it's empty (e.g. backend changes, data source changes):
  if (!mailPolicies.length) return null

  return mailPolicies
}

// Mail UI dates

type MailDeadlineUiDates =
  MailPostmarkedDeadlineUiDates | MailReceivedDeadlineUiDates

type MailPostmarkedDeadlineUiDates = {
  kind: 'MailPostmarkedDeadlineUiDates',
  mainDeadlineDisplay: string,
  mainCountdown: DurationV2,
  currentBrowserTimeDisplay: string, // 2020-09-24 09:00 (UTC-7:00)
  currentStateTimeDisplay: string, // 2020-09-24 08:00 (UTC-8:00)
  startOfFinalDayStateTimeDisplay: string, // 2020-10-04 00:00 (UTC-8:00)
  stateDiffString: string, // '0 days + 00:00:00', from mainCountdown
}

type MailReceivedDeadlineUiDates = {
  kind: 'MailReceivedDeadlineUiDates',
  mainDeadlineDisplay: string,
  mainCountdown: DurationV2,
  currentBrowserTimeDisplay: string, // 2020-09-24 09:00 (UTC-7:00)
  currentStateTimeDisplay: string, // 2020-09-24 08:00 (UTC-8:00)
  startOfFinalDayStateTimeDisplay: string, // 2020-10-04 00:00 (UTC-8:00)
  stateDiffString: string, // '0 days + 00:00:00', from mainCountdown
}

export function getMailDeadlineUiDates(stateData: ClientStateData, timeNow): MailDeadlineUiDates | null {
  // The beginning of this function is a bit WET with `getMailUiKind` for now.

  // 1. Get the mail policy.
  const policies = getMailRegPolicies(stateData)
  if (!policies || !policies.length) {
    throw new Error('Could not find mail policy in state data.', stateData)
  }
  const policy = policies[0]

  // 2. Eliminate the mail registration unavailable case.
  if (policy.kind === 'MailRegNotAvailable') {
    // throw new Error('Cannot get mail dates for state without mail regstration.')
    return null
  }
  const isoDeadline = policy.isoDate

  // 3. Get the dates (listed in online/in person as #1-5).
  const mainDeadlineDisplay = formatDateFromIsoDate(isoDeadline)
  const currentBrowserTime = timeNow // guesses tz from Intl
  const currentBrowserTimeDisplay = isoDateDisplay(currentBrowserTime)
  const stateTz = getMainStateTimezone(stateData.stateAbbrev)
  const currentStateTime = dayjs.tz(currentBrowserTime, stateTz)
  const currentStateTimeDisplay = isoDateDisplay(currentStateTime)
  const startOfFinalDay = `${isoDeadline}T00:00:00`
  const startOfFinalDayStateTime = dayjs.tz(startOfFinalDay, stateTz)
  const startOfFinalDayStateTimeDisplay = isoDateDisplay(startOfFinalDayStateTime)
  const mainCountdown = getDuration(startOfFinalDayStateTime, currentStateTime)

  // 4. Determine the kind of mail deadline.
  const kind = {
    MailRegPostmarkedDeadline: 'MailPostmarkedDeadlineUiDates',
    MailRegReceivedDeadline: 'MailReceivedDeadlineUiDates',
  }[policy.kind]
  if (!kind) {
    throw new Error('Could not determine date type from mail policy kind.')
  }

  const dates = {
    kind,
    mainCountdown,
    mainDeadlineDisplay,
    currentBrowserTimeDisplay, // 2020-09-24 09:00 (UTC-7:00)
    currentStateTimeDisplay, // 2020-09-24 08:00 (UTC-8:00)
    startOfFinalDayStateTimeDisplay, // 2020-10-04 00:00 (UTC-8:00)
  }

  return dates
}

//----------------//
// Methods: misc. //
//----------------//

function getMainStateTimezone(stateAbbrev: string): string {
  const mainStateTimezone = mainStateTimezones[stateAbbrev]
  if (!mainStateTimezone) {
    throw new Error(`Could not find primary state timezone for ${stateAbbrev}.`)
  }
  return mainStateTimezone
}
