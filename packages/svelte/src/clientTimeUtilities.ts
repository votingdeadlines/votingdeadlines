import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'

export const MS_PER_DAY = 1000 * 60 * 60 * 24

const MAX_DURATION_ELEMENTS = 2

// Plugins
//---------

dayjs.extend(customParseFormat)
dayjs.extend(duration) // https://day.js.org/docs/en/plugin/duration
dayjs.extend(relativeTime) // https://day.js.org/docs/en/plugin/relativeTime
dayjs.extend(utc) // https://day.js.org/docs/en/plugin/utc
dayjs.extend(timezone) // https://day.js.org/docs/en/plugin/timezone
dayjs.extend(weekday) // https://day.js.org/docs/en/plugin/weekday

// Types
//-------

// This is a bit redundant with dayjs.Duration (values instead of functions).
//
// The dayjs docs are a little terse, but looking at the code (e.g.
// https://github.com/iamkun/dayjs/blob/master/src/plugin/duration/index.js),
// it seems that duration's `asDays()` and similar just return the number of
// milliseconds in the duration divided by a constant for that unit, e.g.
// 1000 * 60 * 60 * 24 for a day, rather than using a context-sensitive
// notion of the length of a day or something. This means, among other things,
// that noon 2020-10-31 to noon 2020-11-03 in the same timezone will have
// a duration of 3d + 1hr, not 3d, due to DST falling back in that interval.
//
// Also, negative durations are buggy, so we take |diff| before getting the
// duration.
export type DurationV2 = {
  days: number
  daysString: string
  hours: number
  hoursString: string
  minutes: number
  minutesString: string
  seconds: number
  secondsString: string
  hmsString: string
  asString: string
  signedMs: number
}

// Methods
//---------

function now(): dayjs.Dayjs {
  return dayjs().tz(dayjs.tz.guess())
}

// Returns "Sunday, October 4, 2020" from "2020-10-04".
function formatDateFromIsoDate(isoDate: string): string {
  const longDateWithoutWeekdayFormat = 'MMMM D, YYYY'
  const longDateWithWeekdayFormat = `dddd, ${longDateWithoutWeekdayFormat}`
  return dayjs(isoDate).format(longDateWithWeekdayFormat)
}

function getDuration(time1: dayjs.Dayjs, time2: dayjs.Dayjs): DurationV2 {
  // Expect timezones.
  const missingTimezone = !time1.$offset || !time2.$offset
  if (missingTimezone) throw new Error('Time passed with timezone missing.')

  // https://day.js.org/docs/en/durations/diffing
  const differenceInMs = time1.diff(time2)
  // https://github.com/moment/moment/issues/4499 (negative durations buggy)
  const duration = dayjs.duration(Math.abs(differenceInMs))

  // If we use .days(), it will do the modulo for days > 30.
  // If we use .asDays(), it will include the hh:mm:ss in the decimal.
  const days = Math.floor(duration.asDays())
  const daysString = `${String(days).padStart(2, '0')} days`
  const daysNoun = days === 1 ? 'day' : 'days'
  const hours = duration.hours()
  const hoursString = String(hours).padStart(2, '0')
  const minutes = duration.minutes()
  const minutesString = String(minutes).padStart(2, '0')
  const seconds = duration.seconds()
  const secondsString = String(seconds).padStart(2, '0')
  const hmsString = `${hoursString}:${minutesString}:${secondsString}`
  // Preserve the sign of the difference:
  const signedMs = differenceInMs

  return {
    days,
    daysString,
    hours,
    hoursString,
    minutes,
    minutesString,
    seconds,
    secondsString,
    hmsString,
    asString: `${daysString} ${daysNoun} + ${hmsString}`,
    signedMs,
  }
}

function isoDateDisplay(djs) {
  return djs.format('YYYY-MM-DD HH:mm ([UTC]Z)')
}

// Exports
//---------

export const v2 = {
  dayjs: dayjs,
  formatDateFromIsoDate,
  getDuration,
  isoDateDisplay,
  now,
}
