import { v1 } from './clientTimeUtils'
import { MS_PER_DAY } from './clientTimeUtilities'
import type {
  ClientStateData,
  ColorsIndex,
  StateColors,
  REG_NOT_AVAILABLE,
} from './clientTypes'
import {
  getIsOnlineRegAvailable,
  getOnlineDeadlineUiDates,
  getIsInPersonRegAvailable,
  getInPersonDeadlineUiDates,
  getIsMailRegAvailable,
  getMailDeadlineUiDates,
} from './stateUtilities'

const { formatDurationFromIsoDate, getDurationFromIsoDate } = v1

export const COLOR_THRESHHOLDS = {
  // TODO: redo numbers, drop extra color
  MIN_DAYS_V1: {
    GREEN: 20, // green min, yellow max
    YELLOW: 10, // yellow min, red max. E.g. if yellow is 10, anything less than 10 (e.g. 9d23h) falls below.
    RED: 0, // red min
  },
}

export const COLOR_TIER_CLASSES = {
  GREEN: 'ctGreen1', // possibly should be codes that don't map 1:1 to classes.
  YELLOW: 'ctYellow1', // e.g. "ctGreen1" could be a family of green shades.
  RED: 'ctRed1',
  RED_FINAL_DAY: 'ctRed1',
  NONE: 'ctGray1',
}

export function getStateColorsIndex(statesEntries, timeNow): ColorsIndex {
  const index = statesEntries.reduce((memo, stateData: any) => {
    const abbrev = stateData[0]
    const data = stateData[1]

    memo[abbrev] = getStatePattern(data, timeNow)

    return memo
  }, {})

  return index
}

//----//
// v2 //
//----//

function getStatePattern(stateData, timeNow): StateColors {
  return {
    ol: getStateColorOnline(stateData, timeNow),
    ip: getStateColorInPerson(stateData, timeNow),
    ml: getStateColorMail(stateData, timeNow),
  }
}

// This is a rewrite of getStateColors, which was quick and dirty. We should
// be using the same date logic as stateUtilities.ts, so the colors match.
function getStateColorOnline(stateData, timeNow): StateColors {
  const isAvailable = getIsOnlineRegAvailable(stateData)
  if (!isAvailable) return COLOR_TIER_CLASSES.NONE

  const dates = getOnlineDeadlineUiDates(stateData, timeNow)
  return getStateColorDefault(dates)
}

// Same as above for in person.
function getStateColorInPerson(stateData, timeNow): StateColors {
  const isAvailable = getIsInPersonRegAvailable(stateData)
  if (!isAvailable) return COLOR_TIER_CLASSES.NONE

  const dates = getInPersonDeadlineUiDates(stateData, timeNow)
  return getStateColorDefault(dates)
}

// Same as above for mail.
function getStateColorMail(stateData, timeNow): StateColors {
  const isAvailable = getIsMailRegAvailable(stateData)
  if (!isAvailable) return COLOR_TIER_CLASSES.NONE

  const dates = getMailDeadlineUiDates(stateData, timeNow)
  return getStateColorDefault(dates)
}

function getStateColorDefault(dates): string {
  const duration = dates.mainCountdown
  const { days, signedMs } = duration

  // Is it the deadline day? Or passed it?
  //
  // This somewhat convoluted code follows from the fact that we currently
  // count deadlines from the present to the _start_ of the final day, instead
  // of trying to count to the effective closing moment of the final day.
  // (i.e. probably 23:59:59 for online, afternoon sometime for mail/in person).
  // This means that the countdowns will reach '0' when there is exactly one
  // calendar day remaining.
  //
  // At that point the map should read bright red (not gray/passed), and the
  // countdowns should say "TODAY" instead of showing hh:mm:ss.
  const isFinalDay = signedMs < 0 && days === 0
  if (isFinalDay) return COLOR_TIER_CLASSES.RED_FINAL_DAY
  const isPassed = signedMs < 0 && days > 0 // days is an abs (positive) value
  if (isPassed) return COLOR_TIER_CLASSES.NONE

  // If signedMs > 0, it's before the deadline day. Proceed more normally.
  const { MIN_DAYS_V1 } = COLOR_THRESHHOLDS
  if (days >= MIN_DAYS_V1.GREEN) return COLOR_TIER_CLASSES.GREEN
  if (days >= MIN_DAYS_V1.YELLOW) return COLOR_TIER_CLASSES.YELLOW
  if (days >= MIN_DAYS_V1.RED) return COLOR_TIER_CLASSES.RED

  // Because days is an absolute (positive) value, we should never get here:
  return COLOR_TIER_CLASSES.NONE
}
