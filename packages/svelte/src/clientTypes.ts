// This is meant to be the client's gateway to the type system. This may
// new client-only types, and/or types re-exported from the backend, possibly
// modifications.

// These types we attempted to import from the backend, but there were issues.
// export { OnlineRegPolicy } from '../../../src/mergeData'
// It tried to bring the entire backend kitchen sink with it, so for now
// let's just WET and paste the relevant *RegPolicy types here.
// TODO: clean this up, possibly by removing backend type info from
// other backend code more cleanly, so it's easier to import here.
export type ClientOnlineRegPolicy = OnlineRegDeadline | OnlineRegNotAvailable

export const REG_NOT_AVAILABLE = {
  ONLINE: 'OnlineRegNotAvailable',
  IN_PERSON: 'InPersonRegNotAvailable',
  MAIL: 'MailRegNotAvailable',
}

type OnlineRegDeadline = {
  kind: 'OnlineRegDeadline'
  isoDate: string
}

type OnlineRegNotAvailable = {
  kind: 'OnlineRegNotAvailable'
}

export type ClientInPersonRegPolicy =
  | InPersonRegDeadline
  | InPersonRegNotAvailable

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
export type ClientMailRegPolicy =
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

//----------------------//
// From colorUtilities.ts //
//----------------------//

// TODO: merge with mergeData.ts types
export type ClientStateData = {
  onlineRegPolicies: {
    policies: Array<ClientOnlineRegPolicy>
    warnings: Array<string>
  }
  inPersonRegPolicies: {
    policies: Array<ClientInPersonRegPolicy>
    warnings: Array<string>
  }
  mailRegPolicies: {
    policies: Array<ClientMailRegPolicy>
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
  ol: string // classname from COLOR_TIER_CLASSES above
  ip: string
  ml: string
}

export type ColorsIndex = {
  [key: string]: StateColors
}
