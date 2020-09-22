import { v1 } from './clientTimeUtils'

const { formatDurationFromIsoDate, getDurationFromIsoDate } = v1

export const COLOR_THRESHHOLDS = {
  // TODO: redo numbers, drop extra color
  MIN_DAYS_V1: {
    GREEN: 20, // green min, yellow max
    YELLOW: 10, // yellow min, red max. E.g. if yellow is 10, anything less than 10 (e.g. 9d23h) falls below.
    RED: 0, // red min
  }
}

export const COLOR_TIER_CLASSES = {
  GREEN: 'ctGreen1', // possibly should be codes that don't map 1:1 to classes.
  YELLOW: 'ctYellow1', // e.g. "ctGreen1" could be a family of green shades.
  RED: 'ctRed1',
  NONE: 'ctGray1',
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
  if (!days) return COLOR_TIER_CLASSES.NONE

  const { MIN_DAYS_V1 } = COLOR_THRESHHOLDS

  if (days > MIN_DAYS_V1.GREEN) return COLOR_TIER_CLASSES.GREEN
  if (days > MIN_DAYS_V1.YELLOW) return COLOR_TIER_CLASSES.YELLOW
  if (days > MIN_DAYS_V1.RED) return COLOR_TIER_CLASSES.RED

  return COLOR_TIER_CLASSES.NONE
}
