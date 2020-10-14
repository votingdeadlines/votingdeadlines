import type {
  MergedStateReg,
  MergedStateRegIndex,
  RegDeadline,
  RegPolicy,
} from '../mergeData'
import { DayjsType, v1 } from '../timeUtilities'

const { dayjs } = v1

// Convenience functions wrapped around the data.

//-------//
// Types //
//-------//

type VDStateData = MergedStateReg

type VDStateDataArray = Array<VDStateData> // preferred

type VDStateDataMap = MergedStateRegIndex // legacy

type VDStateCategoryMap = {
  [key: string]: Array<VDState>
}

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
    const index = this // eslint-disable-line @typescript-eslint/no-this-alias
    this.states = this.stateDataArray.map((state) => new VDState(state, index))
  }

  static fromMap(stateDataMap: VDStateDataMap): VDStateIndex {
    // console.warn('fromMap: Should pre-flatten map into array and sort instead.')
    const stateDataArray = Object.values(stateDataMap)
    return new VDStateIndex(stateDataArray)
  }

  // Current time
  //--------------

  get date(): string {
    return this.currentDate // shorthand
  }

  // TODO: remove or rename if the aliased function is date only now
  get time(): string {
    return this.currentTimeDisplay // shorthand
  }

  get currentDate(): string {
    // By default, dayjs uses local time, although the underlying djs instance,
    // will be stored as UTC date (djs.$d is an ISO datetime ending in "Z").
    // https://day.js.org/docs/en/parse/utc
    return this.currentDjs.format('YYYY-MM-DD')
  }

  get currentTime(): DayjsType {
    return this.currentDjs
  }

  get currentTimeDisplay(): string {
    // const compactDatetimeFormat = 'ddd, M/D @ h:mm a' // "Sun, 10/2 @ 3:45 pm"
    const longDatetimeFormat = 'dddd, MMMM D, YYYY'
    return this.currentDjs.format(longDatetimeFormat)
  }

  setCurrentTime(djs = dayjs()): DayjsType {
    this.currentDjs = djs
    if (!this.originalDjs) this.originalDjs = this.currentDjs // for debugging
    return this.currentDjs
  }

  refreshCurrentTime(): DayjsType {
    return this.setCurrentTime()
  }

  resetToOriginalTime(): DayjsType {
    return this.setCurrentTime(this.originalDjs)
  }

  incrementCurrentTimeMs(ms: number): DayjsType {
    const incrementedDjs = this.currentDjs.add(ms, 'ms')
    return this.setCurrentTime(incrementedDjs)
  }

  incrementCurrentTimeDays(days: number): DayjsType {
    const MS_PER_DAY = 1000 * 60 * 60 * 24
    return this.incrementCurrentTimeMs(MS_PER_DAY * days)
  }

  // States
  //--------

  get(stateAbbrev: string): VDState | null {
    return (
      this.states.find((state: VDState) => state.abbrev === stateAbbrev) || null
    )
  }

  // TODO: fix or remove
  get nonDCStates(): Array<VDState> {
    return this.states // .filter(s => s.abbrev !== 'DC')
  }

  get sortAlpha(): Array<VDState> {
    function _compareAlphabetically(state1: VDState, state2: VDState): number {
      if (state1.abbrev > state2.abbrev) return 1
      if (state1.abbrev < state2.abbrev) return -1
      throw new Error('States ${state1} and ${state2} not sortable A-Z.')
    }
    return this.states.sort(_compareAlphabetically)
  }

  get sortByDate(): Array<VDState> {
    return this.sortStatesByFinalActiveDeadline // shorthand
  }

  // Compare function to pass to array.sort().
  compareByFinalActiveDeadline(state1: VDState, state2: VDState): number {
    // Send null/expired to the end.
    if (state1.finalActiveDeadline === null) return 1
    if (state2.finalActiveDeadline === null) return -1

    if (state1.finalActiveDeadline > state2.finalActiveDeadline) return 1
    if (state1.finalActiveDeadline < state2.finalActiveDeadline) return -1
    // Tiebreaker
    function _byMeanActiveDeadline(state1: VDState, state2: VDState): number {
      if (state1.meanActiveDeadlineInDays > state2.meanActiveDeadlineInDays) {
        return 1
      }
      if (state1.meanActiveDeadlineInDays < state2.meanActiveDeadlineInDays) {
        return -1
      }
      return 0
    }
    return _byMeanActiveDeadline(state1, state2)
  }

  get sortStatesByFinalActiveDeadline(): Array<VDState> {
    // v1: Final deadline date
    // (v2: Final active deadline date? Or move inactive to end of sort?)
    return this.states.sort(this.compareByFinalActiveDeadline)
  }

  // This could be interpreted/implemented multiple ways, e.g. with final or
  // first deadlines, etc. For now, let's assume we want to be able to get
  // "all states with their final deadline between min and max (inclusive)."
  filterByDate(minDate: string, maxDate = '2020-11-03'): Array<VDState> {
    function _filterByFinalActiveDeadline(state: VDState) {
      const date = state.finalActiveDeadline
      if (date === null) return false
      const dateIsBeforeMin = date < minDate
      const dateIsAfterMax = date > maxDate
      return !dateIsBeforeMin && !dateIsAfterMax
    }

    return this.states.filter(_filterByFinalActiveDeadline)
  }

  // This currently only has day-level precision, based on the browser time.
  // This will make it a bit inaccurate, especially in non-USA timezones.
  // (Previous versions were timezone accurate but perhaps overcomplex.)
  // TODO: restore dayjs().tz()? See also: <details> in vanilla svelte webapp.
  get activeStates(): Array<VDState> {
    return this.filterByDate(this.currentDate)
  }

  endingSoonest(daysInFuture = 10): Array<VDState> {
    const nDaysInFuture = this.currentTime.add(daysInFuture, 'd')
    const nDaysInFutureIsoString = nDaysInFuture.format('YYYY-MM-DD')
    const states = this.filterByDate(this.currentDate, nDaysInFutureIsoString)
    return states.sort(this.compareByFinalActiveDeadline)
  }

  get regions(): VDStateCategoryMap {
    const regionMap = {
      Northeast: 'RI NY DE NJ PA MA ME MD DC CT VT NH'.split(' '),
      South: 'SC FL GA KY AR MS TN TX OK VA WV LA AL NC'.split(' '),
      Midwest: 'IN OH MO KS SD NE MI IL MN WI IA ND'.split(' '),
      West: 'AK AZ OR NV NM HI ID WY UT CO MT CA WA'.split(' '),
    }

    const { compareByFinalActiveDeadline } = this
    function _filter(states: Array<VDState>, region: string): Array<VDState> {
      const filtered = states.filter((s) =>
        regionMap[region].includes(s.abbrev)
      )
      return filtered.sort(compareByFinalActiveDeadline)
    }

    return {
      Northeast: _filter(this.states, 'Northeast'),
      South: _filter(this.states, 'South'),
      Midwest: _filter(this.states, 'Midwest'),
      West: _filter(this.states, 'West'),
    }
  }

  get senateRaces(): Array<VDState> {
    const closeRaces = 'MI AZ CO GA IA ME MT NC GA KS SC AK'.split(' ')
    const states = this.states.filter((s) => closeRaces.includes(s.abbrev))
    return states.sort(this.compareByFinalActiveDeadline)
  }

  get swingStates(): Array<VDState> {
    const stateAbbrevs = 'FL PA WI MI AZ MN NC NV CO OH GA IA ME NE'.split(' ')
    const states = this.states.filter((s) => stateAbbrevs.includes(s.abbrev))
    return states.sort(this.compareByFinalActiveDeadline)
  }
}

//---------//
// VDState //
//---------//

// TODO: break into separate files

export class VDState {
  // Instance types
  //----------------

  data: VDStateData
  index: VDStateIndex // reference to parent for e.g. date logic
  _deadlines?: [string | null, string | null, string | null]
  _soonestActiveDeadline?: string
  _meanActiveDeadlineInDays?: number
  _finalActiveDeadline?: string

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

  // Policies
  //----------

  // Currently these just get the first, i.e. assuming a length of 1. Later
  // we could make it more sophisticated to handle more complex policies, but
  // if so any of this first/[0] logic will need to be reviewed.

  get firstOnlinePolicy(): RegPolicy | undefined {
    return this.data.onlineRegPolicies.policies[0]
  }

  get isOnlineNotNeeded(): boolean {
    const policy = this.firstOnlinePolicy
    return policy && policy.kind === 'RegNotNeeded'
  }

  get isOnlineUnavailable(): boolean {
    const policy = this.firstOnlinePolicy
    return policy && policy.kind === 'OnlineRegNotAvailable'
  }

  get isOnlineDeadline(): boolean {
    const policy = this.firstOnlinePolicy
    return policy && policy.kind === 'OnlineRegDeadline'
  }

  get firstInPersonPolicy(): RegPolicy | undefined {
    return this.data.inPersonRegPolicies.policies[0]
  }

  get isInPersonNotNeeded(): boolean {
    const policy = this.firstInPersonPolicy
    return policy && policy.kind === 'RegNotNeeded'
  }

  get isInPersonUnavailable(): boolean {
    const policy = this.firstInPersonPolicy
    return policy && policy.kind === 'InPersonRegNotAvailable'
  }

  get isInPersonDeadline(): boolean {
    const policy = this.firstInPersonPolicy
    return policy && policy.kind === 'InPersonRegDeadline'
  }

  get firstMailPolicy(): RegPolicy | undefined {
    return this.data.mailRegPolicies.policies[0]
  }

  get isMailNotNeeded(): boolean {
    const policy = this.firstMailPolicy
    return policy && policy.kind === 'RegNotNeeded'
  }

  get isMailUnavailable(): boolean {
    const policy = this.firstMailPolicy
    return policy && policy.kind === 'MailRegNotAvailable'
  }

  get isMailPostmarkedDeadline(): boolean {
    const policy = this.firstMailPolicy
    return policy && policy.kind === 'MailRegPostmarkedDeadline'
  }

  get isMailReceivedDeadline(): boolean {
    const policy = this.firstMailPolicy
    return policy && policy.kind === 'MailRegReceivedDeadline'
  }

  // Time: meta
  //------------

  get currentDate(): string {
    return this.index.currentDate
  }

  // Time: collections
  //-------------------

  get deadlines() {
    if (this._deadlines) return this._deadlines

    function _isoDateOrNull(policy: RegPolicy | undefined) {
      const isDeadline = policy && Object.keys(policy).includes('isoDate') // 🤔
      return isDeadline ? (policy as RegDeadline).isoDate : null
    }

    this._deadlines = [
      _isoDateOrNull(this.firstOnlinePolicy),
      _isoDateOrNull(this.firstInPersonPolicy),
      _isoDateOrNull(this.firstMailPolicy),
    ]
    return this._deadlines
  }

  // Helper for `deadlinesInDays` and `activeDeadlineRangeInDays`, etc.
  deadlineInDays(isoDate: string | null): number | null {
    const currentIsoDate = this.index.currentDate
    if (!isoDate) return null
    const days = dayjs(isoDate).diff(currentIsoDate, 'd')
    return days
  }

  get deadlineInDaysOnline(): number | null {
    return this.deadlinesInDays[0]
  }

  get deadlineInDaysInPerson(): number | null {
    return this.deadlinesInDays[1]
  }

  get deadlineInDaysMail(): number | null {
    return this.deadlinesInDays[1]
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
    // TypeScript tuples don't seem to like array.map
    return [
      this.deadlineInDays(this.deadlines[0]),
      this.deadlineInDays(this.deadlines[1]),
      this.deadlineInDays(this.deadlines[2]),
    ]
  }

  // Short/countdown form of the deadline, e.g. 14 days. Does not handle
  // falsey values.
  get deadlinesDisplay(): [string | null, string | null, string | null] {
    function _deadlineDisplay(days: number | null): string | null {
      if (days === null) return null
      if (days > 1) return `${days} days`
      if (days === 1) return 'tomorrow'
      if (days === 0) return 'TODAY'
      if (days === -1) return 'yesterday'
      if (days < -1) return `${Math.abs(days)} days ago`
      throw new Error(`Error calculating deadlineDisplay: ${days}`)
    }

    // TypeScript tuples don't seem to like array.map
    return [
      _deadlineDisplay(this.deadlinesInDays[0]),
      _deadlineDisplay(this.deadlinesInDays[1]),
      _deadlineDisplay(this.deadlinesInDays[2]),
    ]
  }

  // Long form of the deadline, e.g. Monday, October 10, 2020
  get deadlinesDisplayLong(): [string | null, string | null, string | null] {
    function _deadlineDisplayLong(isoDate: string | null): string | null {
      if (isoDate === null) return null
      return dayjs(isoDate).format('dddd, MMMM D')
    }

    // TypeScript tuples don't seem to like array.map
    return [
      _deadlineDisplayLong(this.deadlines[0]),
      _deadlineDisplayLong(this.deadlines[1]),
      _deadlineDisplayLong(this.deadlines[2]),
    ]
  }

  get truthyDeadlines() {
    const deadlines = this.deadlines
    return deadlines.filter((deadline) => deadline)
  }

  // ❗️ An important method. Deadlines that exist and aren't in the past yet.
  get activeDeadlines() {
    const truthyDeadlines = this.truthyDeadlines
    return truthyDeadlines.filter((deadline) => {
      const isActive = deadline >= this.currentDate
      return isActive
    })
  }

  // Time: reductions
  //------------------

  // The next (possibly first) date to close. Null if all dates are in the past.
  get soonestActiveDeadline(): string | null {
    if (this._soonestActiveDeadline) return this._soonestActiveDeadline

    const activeDeadlines = this.activeDeadlines
    // console.log(activeDeadlines)
    if (!activeDeadlines.length) return null

    this._soonestActiveDeadline = activeDeadlines.sort()[0]
    return this._soonestActiveDeadline
  }

  // The "average" active date to close. For breaking ties during sorts.
  // Technically just the midpoint of the range, not a true mean.
  get meanActiveDeadlineInDays(): number | null {
    if (this._meanActiveDeadlineInDays) return this._meanActiveDeadlineInDays

    const activeDeadlineRange = this.activeDeadlineRangeInDays
    if (!activeDeadlineRange || !activeDeadlineRange.length) return null

    const midpoint = (activeDeadlineRange[0] + activeDeadlineRange[1]) / 2
    return midpoint
  }

  // The last date to close (aka last chance to register). Null if in the past.
  get finalActiveDeadline(): string | null {
    if (this._finalActiveDeadline) return this._finalActiveDeadline

    const activeDeadlines = this.activeDeadlines
    if (!activeDeadlines.length) return null

    this._finalActiveDeadline = activeDeadlines.sort().reverse()[0]
    return this._finalActiveDeadline
  }

  // Returns a tuple, even if both dates are the same, i.e. [earliest, latest].
  get activeDeadlineRange(): Array<string> | null {
    const range = [this.soonestActiveDeadline, this.finalActiveDeadline]
    if (range.includes(null)) return null
    return range
  }

  // Returns a tuple, even if both dates are the same, i.e. [earliest, latest].
  get activeDeadlineRangeInDays(): Array<number> | null {
    const range = [
      this.deadlineInDays(this.soonestActiveDeadline),
      this.deadlineInDays(this.finalActiveDeadline),
    ]
    // console.log(range)
    if (range.includes(null)) return null
    return range
  }

  // Returns "2-5" if a range, or "2" if the ends of the range are the same.
  get activeDeadlineRangeInDaysString() {
    const range = this.activeDeadlineRangeInDays
    // console.log(range)
    if (!range) return ''
    const isSingleDay = range[0] === range[1]
    const numericCopy = isSingleDay ? `${range[0]}` : `${range[0]}-${range[1]}`
    return numericCopy
  }

  // Returns activeDeadlineRangeInDaysString with enhancements.
  get activeDeadlineRangeInDaysDisplay() {
    const literalString = this.activeDeadlineRangeInDaysString
    if (literalString === '') return 'closed' // messy :/
    if (literalString === '0') return 'TODAY'
    return `${literalString}d`
  }

  // Colors
  //--------

  get colors() {
    const COLOR_TIERS = {
      NA: { max: null, colors: 'gray' },
      PASSED: { max: -1, colors: 'gray' },
      TODAY: { max: 0, colors: 'red' },
      SOONEST: { max: 5, colors: 'red' },
      SOONER: { max: 10, colors: 'yellow' },
      LATER: { max: null, colors: 'green' },
    }

    const colorTiers = this.deadlinesInDays.map((d) => {
      if (isNaN(d)) {
        throw new Error('NaN deadline passed to colors getter')
      }

      if (d === null) return COLOR_TIERS.NA
      if (d <= COLOR_TIERS.PASSED.max) return COLOR_TIERS.PASSED
      if (d <= COLOR_TIERS.TODAY.max) return COLOR_TIERS.TODAY
      if (d <= COLOR_TIERS.SOONEST.max) return COLOR_TIERS.SOONEST
      if (d <= COLOR_TIERS.SOONER.max) return COLOR_TIERS.SOONER
      return COLOR_TIERS.LATER
    })

    return {
      ol: colorTiers[0].colors,
      ip: colorTiers[1].colors,
      ml: colorTiers[2].colors,
    }
  }

  get colorsKey() {
    const colors = this.colors
    return `${colors.ol}-${colors.ip}-${colors.ml}`
  }

  // UI types & copy
  //-----------------

  get isTooLateToRegisterOnline(): boolean {
    return this.onlinePolicyUIType === 'Passed'
  }

  get isTooLateToRegister(): boolean {
    return !this.finalActiveDeadline
  }

  get onlinePolicyUIType(): PolicyUIEnum {
    if (this.isOnlineUnavailable) return 'Unavailable'
    if (this.isOnlineNotNeeded) return 'NotNeeded'
    if (this.isOnlineDeadline) {
      const days = this.deadlineInDaysOnline
      if (days >= 0) return 'Countdown'
      if (days < 0) return 'Passed'
    }
    return 'Unsure'
  }

  get inPersonPolicyUIType(): PolicyUIEnum {
    if (this.isInPersonUnavailable) return 'Unavailable'
    if (this.isInPersonNotNeeded) return 'NotNeeded'
    if (this.isInPersonDeadline) {
      const days = this.deadlineInDaysInPerson
      if (days >= 0) return 'Countdown'
      if (days < 0) return 'Passed'
    }
    return 'Unsure'
  }

  get mailPolicyUIType(): PolicyUIEnum {
    if (this.isMailUnavailable) return 'Unavailable'
    if (this.isMailNotNeeded) return 'NotNeeded'
    if (this.isMailPostmarkedDeadline) {
      const days = this.deadlineInDaysMail
      if (days >= 0) return 'MailPostmarkedCountdown'
      if (days < 0) return 'Passed'
    }
    if (this.isMailReceivedDeadline) {
      const days = this.deadlineInDaysMail
      if (days >= 0) return 'MailReceivedCountdown'
      if (days < 0) return 'Passed'
    }
    return 'Unsure'
  }

  policyUIBooleans(regUIType: RegUIType): PolicyUIBooleans {
    function _getBooleans(uiType: PolicyUIEnum) {
      return {
        // Method types
        isOnline: regUIType === 'ONLINE',
        isInPerson: regUIType === 'IN_PERSON',
        isMail: regUIType === 'MAIL',

        // UI types
        isCountdown: uiType === 'Countdown',
        isMailPostmarkedCountdown: uiType === 'MailPostmarkedCountdown',
        isMailReceivedCountdown: uiType === 'MailReceivedCountdown',
        isPassed: uiType === 'Passed',
        isNotNeeded: uiType === 'NotNeeded',
        isUnavailable: uiType === 'Unavailable',
        isUnsure: uiType === 'Unsure',
      }
    }
    if (regUIType == 'ONLINE') return _getBooleans(this.onlinePolicyUIType)
    if (regUIType == 'IN_PERSON') return _getBooleans(this.inPersonPolicyUIType)
    if (regUIType == 'MAIL') return _getBooleans(this.mailPolicyUIType)
    throw new Error(`Could not get policyUIBooleans for ${regUIType}`)
  }

  // Most copy is in the medium-specific methods below, but this one is generic.
  get copy() {
    return {
      // Assumes "AZ " already prefixed, e.g. "10d" for "AZ 10d".
      buttonCopy: this.activeDeadlineRangeInDaysDisplay,
    }
  }

  // Copy helper for "This is in 2 days" vs. "This is tomorrow" in UI.
  thisIs(copy: string | null): string | null {
    if (copy === null) return null
    if (copy.slice(0, 2).toLowerCase() === 'to') return 'This is'
    if (copy.slice(0, 6).toLowerCase() === 'passed') return 'This has'
    return 'This is in'
  }

  get onlineUICopy(): OnlineUICopy {
    let summaryDeadlineDisplay = this.deadlinesDisplay[0]
    if (!summaryDeadlineDisplay && this.isOnlineUnavailable) {
      summaryDeadlineDisplay = 'unavailable'
    }

    return {
      title: 'Online',
      methodCaps: 'Online',
      byMethod: 'online',
      summaryDeadlineDisplay, // the part visible before expanding the caret
      mainDeadlineDisplay: this.deadlinesDisplayLong[0], // Monday, October 2...
      thisIs: this.thisIs(this.deadlinesDisplay[0]), // details prefix
      deadlineDisplayLarge: this.deadlinesDisplay[0], // details
    }
  }

  get inPersonUICopy(): InPersonUICopy {
    let summaryDeadlineDisplay = this.deadlinesDisplay[1]
    if (!summaryDeadlineDisplay && this.isInPersonUnavailable) {
      summaryDeadlineDisplay = 'unavailable'
    }

    return {
      title: 'In Person',
      methodCaps: 'In-person',
      byMethod: 'in person',
      summaryDeadlineDisplay,
      mainDeadlineDisplay: this.deadlinesDisplayLong[1], // Monday, October 2...
      thisIs: this.thisIs(this.deadlinesDisplay[1]), // details prefix
      deadlineDisplayLarge: this.deadlinesDisplay[1], // details
    }
  }

  get mailUICopy(): MailUICopy {
    let summaryDeadlineDisplay = this.deadlinesDisplay[2]
    if (!summaryDeadlineDisplay && this.isMailUnavailable) {
      summaryDeadlineDisplay = 'unavailable'
    }

    return {
      title: 'Mail',
      methodCaps: 'Mail', // workshop copy to clarify mail reg vs. mail voting
      byMethod: 'by mail',
      summaryDeadlineDisplay,
      mainDeadlineDisplay: this.deadlinesDisplayLong[2], // Monday, October 2...
      thisIs: this.thisIs(this.deadlinesDisplay[2]), // details prefix
      deadlineDisplayLarge: this.deadlinesDisplay[2], // details
    }
  }

  policyUICopy(regUIType: RegUIType): PolicyUICopy {
    if (regUIType === 'ONLINE') return this.onlineUICopy
    if (regUIType === 'IN_PERSON') return this.inPersonUICopy
    if (regUIType === 'MAIL') return this.mailUICopy
    throw new Error('Could not get policyUICopy.')
  }

  stringToSlug(string: string): string {
    const lcString = string.toLowerCase()
    const saferString = lcString
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    return saferString
  }

  get slug() {
    return this.stringToSlug(this.name)
  }

  // Links

  get officialRegistrationLink(): string | null {
    return this.data.registrationLinkEn
  }

  get officialInfoLink(): string {
    return this.data.moreInfoLinkEn
  }

  get officialCheckRegStatusLink(): string {
    return this.data.checkRegStatusLink
  }
}

// TODO: DRY with types/deadlineCards.ts
type RegUIType = 'ONLINE' | 'IN_PERSON' | 'MAIL'

// High level user-facing projections of the policies in the data.
// (How to best move into the class? The union/enum is also too loose.)
type PolicyUIBooleans = {
  isCountdown: boolean // is generic/non-mail countdown, more precisely
  isMailPostmarkedCountdown: boolean
  isMailReceivedCountdown: boolean
  isPassed: boolean
  isNotNeeded: boolean
  isUnavailable: boolean
  isUnsure: boolean
}

type PolicyUIBooleansTuple = {
  onlineUI: PolicyUIBooleans
  inPersonUI: PolicyUIBooleans
  mailUI: PolicyUIBooleans
}

type PolicyUIEnum =
  | 'Countdown'
  | 'MailPostmarkedCountdown'
  | 'MailReceivedCountdown'
  | 'NotNeeded'
  | 'Passed'
  | 'Unavailable'
  | 'Unsure'

type PolicyUICopy = OnlineUICopy | InPersonUICopy | MailUICopy

type OnlineUICopy = {
  [key: string]: string
}

type InPersonUICopy = {
  [key: string]: string
}

type MailUICopy = {
  [key: string]: string
}
