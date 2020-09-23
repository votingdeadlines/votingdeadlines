const repl = require("repl")

// Dayjs
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const duration = require('dayjs/plugin/duration')
const relativeTime = require('dayjs/plugin/relativeTime')
const timezone = require('dayjs/plugin/timezone')
const utc = require('dayjs/plugin/utc')
const weekday = require('dayjs/plugin/weekday')
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekday)

// Start
const replServer = repl.start({})

// Import
replServer.context.dayjs = dayjs
