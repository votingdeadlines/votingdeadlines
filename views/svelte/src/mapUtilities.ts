import { v1 } from './clientTimeUtils'

const { formatDurationFromIsoDate, getDurationFromIsoDate } = v1

export const COLOR_THRESHHOLDS = {
  MIN_DAYS_V1: {
    GREEN_: 30, // 30+
    YELLOW: 20, // 20-30
    ORANGE: 10,
    RED___: 0,
  }
}

export const COLOR_TIER_CLASSES = {
  GREEN_: 'ctGreen1', // possibly should be codes that don't map 1:1 to classes.
  YELLOW: 'ctYellow1', // e.g. "ctGreen1" could be a family of green shades.
  ORANGE: 'ctOrange1',
  RED___: 'ctRed1',
  // PASSED: 'ctDarkGray1',
  NONE__: 'ctLightGray1',
}

// This is a simplification of ../data's state type, until we merge/DRY them.
export type ClientStateData = {
  onlineRegPolicies: {
    policies: Array<ClientSimplifiedStatePolicy>
    warnings: Array<string>
  }
  inPersonRegPolicies: {
    policies: Array<ClientSimplifiedStatePolicy>
    warnings: Array<string>
  }
  mailRegPolicies: {
    policies: Array<ClientSimplifiedStatePolicy>
    warnings: Array<string>
  }
}

type ClientStateDataIndex = {
  [key: string]: ClientStateData
}

type ClientSimplifiedStatePolicy = {
  kind: string
  isoDate?: string // missing for states where you can't register that way, etc.
}

export type StateColors = {
  ol: string, // classname from COLOR_TIER_CLASSES above
  ip: string,
  ml: string,
}

export type ColorsIndex = {
  [key: string]: StateColors
}

export function getStateColorsIndex(statesData): ColorsIndex {
  const index = Object.entries(statesData).reduce((memo, stateData: any) => {
    const abbrev = stateData[0]
    const data = stateData[1]

    memo[abbrev] = getStateColors(data)

    return memo
  }, {})

  return index
}

// Get the 3-part collection of color codes (e.g. red/red/orange) for a state.
export function getStateColors(stateData: ClientStateData): StateColors {
  const { onlineRegPolicies, inPersonRegPolicies, mailRegPolicies } = stateData
  const olPolicies = onlineRegPolicies.policies
  const ipPolicies = inPersonRegPolicies.policies
  const mlPolicies = mailRegPolicies.policies

  if (olPolicies.length > 1) console.warn('olPolicies.length > 1')
  if (ipPolicies.length > 1) console.warn('ipPolicies.length > 1')
  if (mlPolicies.length > 1) console.warn('mlPolicies.length > 1')

  // The code depends on the duration from now, not the date per se.
  const durations = {
    ol: getDurationFromIsoDate(olPolicies[0].isoDate),
    ip: getDurationFromIsoDate(ipPolicies[0].isoDate),
    ml: getDurationFromIsoDate(mlPolicies[0].isoDate),
  }

  const stateColors = {
    ol: _getRegColorTier(durations.ol.D), // maybe falsey
    ip: _getRegColorTier(durations.ip.D), // maybe falsey
    ml: _getRegColorTier(durations.ml.D), // maybe falsey
  }

  return stateColors
}

// Helper to get the color code (e.g. red) for an individual deadline duration.
function _getRegColorTier(days: number): string {
  if (!days) return COLOR_TIER_CLASSES.NONE__

  const { MIN_DAYS_V1 } = COLOR_THRESHHOLDS
  if (days > MIN_DAYS_V1.GREEN_) return COLOR_TIER_CLASSES.GREEN_
  if (days > MIN_DAYS_V1.YELLOW) return COLOR_TIER_CLASSES.YELLOW
  if (days > MIN_DAYS_V1.ORANGE) return COLOR_TIER_CLASSES.ORANGE
  if (days > MIN_DAYS_V1.RED___) return COLOR_TIER_CLASSES.RED___
}































// Online-only prototype
export function getStateTierV0(isoDate: string): string {
  const duration = getDurationFromIsoDate(isoDate)
  const durationDays = duration.D
  let durationTier
  if (durationDays > 30) durationTier = 'gt-30d' // green
  if (durationDays < 30) durationTier = 'lt-30d' // lime green
  if (durationDays < 26) durationTier = 'lt-26d' // yellow
  if (durationDays < 22) durationTier = 'lt-22d' // orange
  if (durationDays < 18) durationTier = 'lt-18d' // red
  if (!durationDays) durationTier = ''
  return durationTier
}
