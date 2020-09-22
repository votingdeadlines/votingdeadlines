import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

const MAX_DURATION_ELEMENTS = 2

// Plugins
//---------

dayjs.extend(customParseFormat);
dayjs.extend(duration); // https://day.js.org/docs/en/plugin/duration
dayjs.extend(relativeTime); // https://day.js.org/docs/en/plugin/relativeTime
dayjs.extend(utc); // https://day.js.org/docs/en/plugin/utc
dayjs.extend(weekday); // https://day.js.org/docs/en/plugin/weekday

// Types
//-------

// A bit redundant with dayjs.Duration (values instead of functions)
type Duration = {
  // Y: number;
  // M: number;
  D: number;
  hrs: number;
  min: number;
  sec: number;
};

// Methods
//---------

function now(): dayjs.Dayjs {
  return dayjs();
}

// This requires a duration argument.
function formatDuration(duration: Duration, elements = MAX_DURATION_ELEMENTS): string {
  const { D, hrs, min, sec } = duration;
  const strings = [];

  const isNegative = Object.values(duration).some((n) => n < 0);
  if (isNegative) return ""; // Maybe support both in the future

  // if (Y) strings.push(yearsDisplay(Y));
  // if (M && strings.length < elements) strings.push(monthsDisplay(M));
  if (D && strings.length < elements) strings.push(daysDisplay(D));
  if (hrs && strings.length < elements) strings.push(hoursDisplay(hrs));
  if (min && strings.length < elements) strings.push(minutesDisplay(min));
  if (sec && strings.length < elements) strings.push(secondsDisplay(sec));

  return strings.join(" : ");
}

function pad(num: number): string {
  return String(num).padStart(2, '0')
}

function daysDisplay(num: number) {
  const integer = Math.floor(num)
  const padded = pad(integer)
  return `${padded} days`
}

function hoursDisplay(num: number) {
  return `${pad(num)} hours`
}

function minutesDisplay(num: number) {
  return `${pad(num)}`
}

function secondsDisplay(num: number) {
  const string = dayjs.duration(num, "seconds").humanize(false);
  const noun = string.match(/\w+$/)[0]
  return `${pad(num)}`
}

// This gets a duration for you, and formats it.
function formatDurationFromTime(
  time1: dayjs.Dayjs,
  time2: dayjs.Dayjs = now(),
  elements = MAX_DURATION_ELEMENTS
): string {
  return formatDuration(getDuration(time1, time2), elements);
}

// This gets a duration for you, and formats it, from an ISO string
function formatDurationFromIsoDate(
  isoDate: string,
  time2: dayjs.Dayjs = now(),
  elements = MAX_DURATION_ELEMENTS
): string {
  const time1 = dayjs(isoDate)
  return formatDurationFromTime(time1, time2, elements);
}


function getDuration(time1: dayjs.Dayjs, time2: dayjs.Dayjs = now()): Duration {
  // https://day.js.org/docs/en/durations/diffing
  const duration = dayjs.duration(time1.diff(time2));

  return {
    // Y: duration.years(),
    // M: duration.months(),
    D: duration.asDays(),
    hrs: duration.hours(),
    min: duration.minutes(),
    sec: duration.seconds(),
  };
}

function getDurationFromIsoDate(isoDate: string): Duration {
  return getDuration(dayjs(isoDate))
}

// Exports
//---------

export const v1 = {
  dayjs: dayjs,
  formatDurationFromIsoDate,
  getDuration,
  getDurationFromIsoDate,
};
