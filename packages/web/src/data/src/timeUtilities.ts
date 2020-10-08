// https://day.js.org/docs/en/

import { default as dayjs } from 'dayjs'
import { default as customParseFormat } from 'dayjs/plugin/customParseFormat'
import { default as utc } from 'dayjs/plugin/utc'
import { default as weekday } from 'dayjs/plugin/weekday'

// Plugins
//---------

dayjs.extend(customParseFormat)
dayjs.extend(utc) // https://day.js.org/docs/en/plugin/utc
dayjs.extend(weekday) // https://day.js.org/docs/en/plugin/weekday

// Types
//-------

type NaiveIsoDate = {
  toString: () => string // YYYY-MM-DD with no handling of time or timezone
  djs: dayjs.Dayjs // the underlying instance for debugging/etc.
}

// Not sure how to export this type via the `v1` object (as type vs as value).
export type DayjsType = dayjs.Dayjs

type timeUtilities = {
  dayjs: (arg?: any) => DayjsType
  parseUsaDateToNaiveIsoDate: (dateString: string) => NaiveIsoDate
  parseUsaLongDateToNaiveIsoDate: (dateString: string) => NaiveIsoDate
}

// Take I
//--------

const ISO_DATE_LENGTH = 'YYYY-MM-DD'.length // 10
// These regexes are scoped to the 21st century, and even to 2020 specifically.
// If this project broadens in scope to include later or historical elections,
// this can be relaxed. In the meantime these double as date sanity checks.
const usaDateRegex = /^\w+ \d{1,2}, 20\d{2}$/
const usa2020DateRegex = /^\w+ \d{1,2}, 2020$/
const usaLongDateRegex = /^\w+, (\w+ \d{1,2}, 20\d{2})$/
const usaLong2020DateRegex = /^\w+, (\w+ \d{1,2}, 2020)$/
const usaLongDateWithoutWeekdayFormat = 'MMMM D, YYYY'
const usaLongDateWithWeekdayFormat = `dddd, ${usaLongDateWithoutWeekdayFormat}`

function parseUsaDateToNaiveIsoDate(date: string): NaiveIsoDate {
  if (!date) {
    throw new Error(`No date passed: ${date}`)
  }

  const usaDateRegexMatch = date.match(usaDateRegex)
  if (!usaDateRegexMatch) {
    throw new Error(`Invalid date string passed: '${date}'`)
  }

  const usa2020DateRegexMatch = date.match(usa2020DateRegex)
  if (!usa2020DateRegexMatch) {
    throw new Error(`Non-2020 date passed: '${date}'`)
  }

  const djs = dayjs(date, usaLongDateWithoutWeekdayFormat).utc()

  // Incredibly, it seems that dayjs will parse an invalid date like October 33!
  // And call it November 2. So don't trust `.isValid()` completely. According
  // to dayjs/issues/320, we can mitigate this by recreating the date (below).
  if (!djs.isValid()) {
    throw new Error(`Invalid date string: '${date}'`)
  }

  // This mitigates the above by checking the passed date matches a recreation.
  const recreatedDate = djs.format(usaLongDateWithoutWeekdayFormat)
  if (recreatedDate !== date) {
    throw new Error(`Invalid date: '${date}'`)
  }

  const isoString = djs.toISOString().slice(0, ISO_DATE_LENGTH)

  const naiveIsoDate = {
    toString: () => isoString,
    djs,
  }

  return naiveIsoDate
}

function parseUsaLongDateToNaiveIsoDate(date: string): NaiveIsoDate {
  if (!date) {
    throw new Error(`No date passed: ${date}`)
  }

  const usaLongDateRegexMatch = date.match(usaLongDateRegex)
  if (!usaLongDateRegexMatch) {
    throw new Error(`Invalid date string passed: '${date}'`)
  }

  const usaLong2020DateRegexMatch = date.match(usaLong2020DateRegex)
  if (!usaLong2020DateRegexMatch) {
    throw new Error(`Non-2020 date passed: '${date}'`)
  }

  // Remove the weekday for parsing. (We check that it matches later.)
  const dateWithoutWeekday = usaLongDateRegexMatch[1]
  const djs = dayjs(dateWithoutWeekday, usaLongDateWithoutWeekdayFormat).utc()

  if (!djs.isValid()) {
    throw new Error(`Invalid date string: '${dateWithoutWeekday}'`)
  }

  // Verify the day of week originally passed was correct
  const recreatedDate = djs.format(usaLongDateWithWeekdayFormat)
  if (recreatedDate !== date) {
    throw new Error(`Invalid date (is the weekday correct?): '${date}'`)
  }

  const isoString = djs.toISOString().slice(0, ISO_DATE_LENGTH)

  const naiveIsoDate = {
    toString: () => isoString,
    djs,
  }

  return naiveIsoDate
}

// Versioning because time is tricky, and we may need several passes at it.
// It is easier to append a new version than fix and be backwards-compatible.
export const v1: timeUtilities = {
  dayjs,
  parseUsaDateToNaiveIsoDate,
  parseUsaLongDateToNaiveIsoDate,
}
