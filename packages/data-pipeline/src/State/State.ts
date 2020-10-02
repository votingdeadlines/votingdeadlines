import type { MergedStateReg, MergedStateRegIndex, RegDeadline, RegPolicy } from '../mergeData'
import { DayjsType, v1 } from '../timeUtilities'

const { dayjs } = v1

// Convenience functions wrapped around the data.

//-------//
// Types //
//-------//

type VDStateData = MergedStateReg

type VDStateDataArray = Array<VDStateData> // preferred

type VDStateDataMap = MergedStateRegIndex // legacy

//--------------//
// VDStateIndex //
//--------------//

export class VDStateIndex {
  // Instance types
  //----------------

  currentDjs: DayjsType
  originalDjs: DayjsType
  stateDataArray: VDStateDataArray // original data, for debugging
  states: Array<VDState>

  // Construction
  //--------------

  constructor(vdStateDataArray: VDStateDataArray) {
    this.setCurrentTime()
    this.stateDataArray = vdStateDataArray
    const index = this
    this.states = this.stateDataArray.map(state => new VDState(state, index))
  }

  static fromMap(stateDataMap: VDStateDataMap) {
    console.warn("fromMap: Should pre-flatten map into array and sort instead.")
    const stateDataArray = Object.values(stateDataMap)
    return new VDStateIndex(stateDataArray)
  }

  // Current time
  //--------------

  get date() {
    return this.currentDate // shorthand
  }

  get time() {
    return this.currentTimeDisplay // shorthand
  }

  get currentDate() {
    // By default, dayjs uses local time, although the underlying djs instance,
    // will be stored as UTC date (djs.$d is an ISO datetime ending in "Z").
    // https://day.js.org/docs/en/parse/utc
    return this.currentDjs.format('YYYY-MM-DD')
  }

  get currentTime() {
    return this.currentDjs
  }

  get currentTimeDisplay() {
    const compactDatetimeFormat = 'ddd, M/D @ h:mm a' // "Sun, 10/2 @ 3:45 pm"
    return this.currentDjs.format(compactDatetimeFormat)
  }

  setCurrentTime(djs = dayjs()) {
    this.currentDjs = djs
    if (!this.originalDjs) this.originalDjs = this.currentDjs // for debugging
    return this.currentDjs
  }

  refreshCurrentTime() {
    return this.setCurrentTime()
  }

  resetToOriginalTime() {
    return this.setCurrentTime(this.originalDjs)
  }

  incrementCurrentTimeMs(ms: number) {
    const incrementedDjs = this.currentDjs.add(ms, 'ms')
    return this.setCurrentTime(incrementedDjs)
  }

  incrementCurrentTimeDays(days: number) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24
    return this.incrementCurrentTimeMs(MS_PER_DAY * days)
  }

  // States
  //--------

  get(stateAbbrev: string): VDState | null {
    return this.states.find((state: VDState) => state.abbrev === stateAbbrev)
      || null
  }

  // This currently only has day-level precision, based on the browser time.
  // This will make it a bit inaccurate, especially in non-USA timezones.
  // (Previous versions were timezone accurate but perhaps overcomplex.)
  // TODO: restore dayjs().tz()? See also: <details> in vanilla svelte webapp.
  get activeStates() {
    const currentIsoDate = '2020-10-00' // TODO:
    // Better would be currentIsoDate in state local time
    return this.states.filter(s => s.finalDeadlineDate >= currentIsoDate)
  }

  get sortedByDate() {
    return this.statesSortedByFinalDeadlineDate // shorthand
  }

  get statesSortedByFinalDeadlineDate() {
    // v1: Final deadline date
    // (v2: Final active deadline date?)
    function compareStates(state1: VDState, state2: VDState): number {
      if (state1.finalDeadlineDate > state2.finalDeadlineDate) return 1
      if (state1.finalDeadlineDate < state2.finalDeadlineDate) return -1
      return 0
    }
    return this.states.sort(compareStates)
  }
}

//---------//
// VDState //
//---------//

export class VDState {
  // Instance types
  //----------------

  data: VDStateData
  index: VDStateIndex // reference to parent for e.g. date logic
  _deadlineDates?: [string | null, string | null, string | null]
  _finalDeadlineDate?: string

  // Construction
  //----------------

  constructor(data: VDStateData, index: VDStateIndex) {
    this.data = data
    this.index = index
  }

  // Names
  //-------

  get abbrev() {
    return this.data.stateAbbrev
  }

  get name() {
    return this.data.stateName
  }

  // Time
  //------

  get deadlineDates() {
    if (this._deadlineDates) return this._deadlineDates

    function _isoDateOrNull(policy: RegPolicy | undefined) {
      const isDeadline = policy && Object.keys(policy).includes('isoDate') // 🤔
      return isDeadline ? (policy as RegDeadline).isoDate : null
    }

    this._deadlineDates = [
      _isoDateOrNull(this.data.onlineRegPolicies.policies[0]),
      _isoDateOrNull(this.data.inPersonRegPolicies.policies[0]),
      _isoDateOrNull(this.data.mailRegPolicies.policies[0]),
    ]
    return this._deadlineDates
  }

  // Possibly there isn't really much benefit in adding time precision at this
  // stage. Local browser date (even outside of US time zones) is probably fine.
  // get activeDeadlineDates() {
  //   const deadlines = this.truthyDeadlineDates
  //   return deadlines.filter(deadline => deadline)
  // }

  get truthyDeadlineDates() {
    const deadlines = this.deadlineDates
    return deadlines.filter(deadline => deadline)
  }

  get finalDeadlineDate() {
    if (this._finalDeadlineDate) return this._finalDeadlineDate

    const deadlines = this.truthyDeadlineDates
    if (!deadlines.length) {
      throw new Error(`${this.abbrev}: No non-null deadline dates found.`)
    }

    this._finalDeadlineDate = deadlines.sort().reverse()[0]
    return this._finalDeadlineDate
  }
}

// Fake states with minimal data for testing
export const VD_FIXTURE: VDStateDataArray = [
  {
    stateAbbrev: 'AA',
    stateName: 'Akaska',
    onlineRegPolicies: { policies: [
      { kind: 'OnlineRegDeadline', isoDate: '2020-10-05' }
    ], warnings: [], },
    inPersonRegPolicies: { policies: [
      { kind: 'InPersonRegDeadline', isoDate: '2020-11-03' }
    ], warnings: [], },
    mailRegPolicies: { policies: [], warnings: [], },
    registrationLinkEn: 'https://akaska.gov.example.com/register.htm'
  },
  {
    stateAbbrev: 'BA',
    stateName: 'Balaska',
    onlineRegPolicies: { policies: [
      { kind: 'OnlineRegDeadline', isoDate: '2020-10-04' }
    ], warnings: [], },
    inPersonRegPolicies: { policies: [], warnings: [], },
    mailRegPolicies: { policies: [], warnings: [], },
    registrationLinkEn: 'https://balaska.gov.example.com/register.html'
  },
  {
    stateAbbrev: 'CA',
    stateName: 'Calaska',
    onlineRegPolicies: { policies: [
      { kind: 'OnlineRegDeadline', isoDate: '2020-10-06' }
    ], warnings: [], },
    inPersonRegPolicies: { policies: [], warnings: [], },
    mailRegPolicies: { policies: [], warnings: [], },
    registrationLinkEn: 'https://calaska.gov.example.com/register.aspx'
  },
]
