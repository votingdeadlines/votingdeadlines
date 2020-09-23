import { v1 } from './clientTimeUtils'
import { v2 } from './clientTimeUtilities'

describe('clientTimeUtilities.ts', () => {
  describe('v1', () => {
    describe('getDurationFromIsoDate', () => {
      const { dayjs, getDurationFromIsoDate } = v1

      // These first two tests use naive duration calculations, and so will
      // probably break once we add proper timezone handing (see further down).

      it('gets a duration from an ISO date string', () => {
        const result = getDurationFromIsoDate('2020-11-01', dayjs('2020-09-23'))

        expect(result).toStrictEqual({ D: 39, hrs: 0, min: 0, sec: 0 })
      })

      it('rounds the number of days down to an integer', () => {
        // This range, despite appearing like a multiple of 24 hours, returns
        // 41 days and 1 hour, due to daylight saving time. This confirms that
        // we are not using floats for the day (due to Math.floor).
        const result = getDurationFromIsoDate('2020-11-03', dayjs('2020-09-23'))

        expect(result).toStrictEqual({ D: 41, hrs: 1, min: 0, sec: 0 })
      })

      })
    })

  describe('v2', () => {

    //-----------//
    // Timezones //
    //-----------//

    /*
    Timezones are hard to reason about. Let's break this down.

    Consider Alaska:

    Alaska's deadline for all registration types is "October 4, 2020". This
    is a naive calendar date, without an explicit concept of time.

    Implicitly, it is subject to at least two time-related constraints:

      1. The date will be determined by Alaska local time, not (say) EST
      2. The effective end of registration will be the close of business

    For #1, most of the state is on AKST/AKDT, which includes Anchorage.
    There is a tz called `America/Anchorage`.

    For online registration, #2 is probably midnight that day. For in-person,
    it's probably the closing time of the local election offices. For mail,
    it's probably the closing time of your local post office, or the last
    mailbox pickup times.

    Let's say a user is browsing the site on 2020-09-24 17:45:00 PDT.

    What time data should we show?

    1. Your current time is: 2020-09-24 15:45:00 PDT
    2. Current Alaska time: 2020-09-24 14:45:00 AKDT [+0, just tz change]
    3. Start of final day: 2020-10-04 00:00:00 AKST
    4. Difference:
      - manually seems like:
        - xxxx-xx-xx 09:15:00 till 2020-09-25
        - 6 more days in sept
        - 3 days in oct
        - +1h for DST
        = (9 * 24 hrs) + 1hr + (9hr + 15min)
        = 226 hrs + 15min
        = 9 days + 10:15:00

    We could try to ignore DST, but I think it may be even more complicated.

    */
    describe('timezone-aware duration calculations', () => {
      const { dayjs } = v2

      it('calculates differences across time zones', () => {
        // 1. Your current time is: 2020-09-24 15:45:00 PDT
        const currentLocalTime = dayjs.tz('2020-09-24T15:45:00', 'America/Los_Angeles')

        // 2. Current Alaska time: 2020-09-24 14:45:00 AKDT [+0, just tz change]
        const currentAlaskaTime = dayjs.tz('2020-09-24T14:45:00', 'America/Anchorage')

        // Sanity check that we don't have a problem already at this stage.
        const currentTimeDiff = currentLocalTime.diff(currentAlaskaTime)
        expect(currentTimeDiff).toBe(0)

        // 3. Start of final day: 2020-10-04 00:00:00 AKST
        const startOfFinalDay = '2020-10-04T00:00:00'
        const startOfFinalDayAlaskaTime = dayjs.tz(`${startOfFinalDay}`, 'America/Anchorage')

        // Verify actual deadline difference (future.diff(present) is positive)
        const alaskaDiff = startOfFinalDayAlaskaTime.diff(currentAlaskaTime)
        const ms9Days = 9 * 24 * 60 * 60 * 1000
        const ms10hours = 9 * 60 * 60 * 1000
        const ms15minutes = 15 * 60 * 1000
        const expectedMs = ms9Days + ms10hours + ms15minutes

        // Test
        expect(alaskaDiff).toBe(expectedMs)
      })
    })
  })
})
