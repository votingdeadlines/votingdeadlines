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

  get sortAlpha() {
    function _compareAlphabetically(state1: VDState, state2: VDState): number {
      if (state1.abbrev > state2.abbrev) return 1
      if (state1.abbrev < state2.abbrev) return -1
      throw new Error('States ${state1} and ${state2} not sortable A-Z.')
    }
    return this.states.sort(_compareAlphabetically)
  }

  get sortByDate() {
    return this.sortStatesByFinalDeadlineDate // shorthand
  }

  // Compare function to pass to array.sort().
  compareByFinalDeadline(state1: VDState, state2: VDState): number {
    if (state1.finalDeadlineDate > state2.finalDeadlineDate) return 1
    if (state1.finalDeadlineDate < state2.finalDeadlineDate) return -1
    return 0
  }

  get sortStatesByFinalDeadlineDate() {
    // v1: Final deadline date
    // (v2: Final active deadline date? Or move inactive to end of sort?)
    return this.states.sort(this.compareByFinalDeadline)
  }

  // This could be interpreted/implemented multiple ways, e.g. with final or
  // first deadlines, etc. For now, let's assume we want to be able to get
  // "all states with their final deadline between min and max (inclusive)."
  filterByDate(minDate: string, maxDate: string = '2020-11-03') {
    function _filterByFinalDeadline(state: VDState) {
      const date = state.finalDeadlineDate
      const dateIsBeforeMin = date < minDate
      const dateIsAfterMax = date > maxDate
      return !dateIsBeforeMin && !dateIsAfterMax
    }

    return this.states.filter(_filterByFinalDeadline)
  }

  // This currently only has day-level precision, based on the browser time.
  // This will make it a bit inaccurate, especially in non-USA timezones.
  // (Previous versions were timezone accurate but perhaps overcomplex.)
  // TODO: restore dayjs().tz()? See also: <details> in vanilla svelte webapp.
  get activeStates() {
    return this.filterByDate(this.currentDate)
  }

  endingSoonest(daysInFuture: number = 10) {
    const nDaysInFuture = this.currentTime.add(daysInFuture, 'd')
    const nDaysInFutureIsoString = nDaysInFuture.format('YYYY-MM-DD')
    const states = this.filterByDate(this.currentDate, nDaysInFutureIsoString)
    return states.sort(this.compareByFinalDeadline)
  }

  get regions() {
    const regionMap = {
      Northeast: "RI NY DE NJ PA MA ME MD DC CT VT NH".split(" "),
      South: "SC FL GA KY AR MS TN TX OK VA WV LA AL NC".split(" "),
      Midwest: "IN OH MO KS SD NE MI IL MN WI IA ND".split(" "),
      West: "AK AZ OR NV NM HI ID WY UT CO MT CA WA".split(" "),
    }

    const { compareByFinalDeadline } = this
    function _filter(states: Array<VDState>, region: string): Array<VDState> {
      const filtered = states.filter(s => regionMap[region].includes(s.abbrev))
      return filtered.sort(compareByFinalDeadline)
    }

    return {
      Northeast: _filter(this.states, 'Northeast'),
      South: _filter(this.states, 'South'),
      Midwest: _filter(this.states, 'Midwest'),
      West: _filter(this.states, 'West'),
    }
  }

  get swingStates() {
    const stateAbbrevs = 'FL PA WI MI AZ MN NC NV CO OH'.split(' ')
    const states = this.states.filter(s => stateAbbrevs.includes(s.abbrev))
    return states.sort(this.compareByFinalDeadline)
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

  // Should return a number indicating the _approximate_ amount of days left.
  // As usual with time, context is important and it can be interpreted in
  // multiple ways. The current intended interpretation is:
  // 1. Hour/minute/second precision seems to be TMI for many purposes.
  // 2. Calendar days seem more intuitive than days as 24 hour periods.
  // 3. E.g. if it is 2020-10-01, and the deadline is 2020-10-05, "4 days left".
  // 4. For now, the first time (2020-10-01) will be local browser time, so
  //    this will be somewhat imprecise depending on the browser timezone.
  // 5. Soon we can add in dayjs.tz (see vanilla svelte app) to add precision.
  get deadlinesInDays(): [number | null, number | null, number | null] {
    const currentIsoDate = this.index.currentDate // removes time precision
    function _deadlineInDays(isoDate: string | null): number | null {
      if (!isoDate) return null
      const days = dayjs(isoDate).diff(currentIsoDate, 'd')
      return days
    }

    // TypeScript tuples don't seem to like array.map
    return [
      _deadlineInDays(this.deadlineDates[0]),
      _deadlineInDays(this.deadlineDates[1]),
      _deadlineInDays(this.deadlineDates[2]),
    ]
  }

  get deadlinesDisplay(): [string | null, string | null, string | null] {
    function _deadlineDisplay(days: number | null): string | null{
      if (!days === null) return null
      if (days > 1) return `${days} days`
      if (days === 1) return 'tomorrow'
      if (days === 0) return 'today'
      if (days === -1) return 'yesterday'
      if (days < -1) return `${days} days ago`
      throw new Error(`Error calculating deadlineDisplay: ${days}`)
    }

    // TypeScript tuples don't seem to like array.map
    return [
      _deadlineDisplay(this.deadlinesInDays[0]),
      _deadlineDisplay(this.deadlinesInDays[1]),
      _deadlineDisplay(this.deadlinesInDays[2]),
    ]
  }

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
  {
    stateAbbrev: 'DA',
    stateName: 'Dalaska',
    onlineRegPolicies: { policies: [
      { kind: 'OnlineRegDeadline', isoDate: '2020-10-01' }
    ], warnings: [], },
    inPersonRegPolicies: { policies: [], warnings: [], },
    mailRegPolicies: { policies: [], warnings: [], },
    registrationLinkEn: 'https://dalaska.gov.example.com/register.php'
  },
]
