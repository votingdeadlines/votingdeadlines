import { v1 } from './timeUtilities'

describe('timeUtilities.ts', () => {
  describe('v1', () => {
    describe('parseUsaDateToNaiveIsoDate', () => {
      it('parses dates', () => {
        const parse = v1.parseUsaDateToNaiveIsoDate
        const expectations = [
          [parse('January 1, 2020'), '2020-01-01'],
          [parse('January 2, 2020'), '2020-01-02'],
          [parse('September 15, 2020'), '2020-09-15'],
          [parse('October 19, 2020'), '2020-10-19'],
          [parse('October 4, 2020'), '2020-10-04'],
          [parse('October 5, 2020'), '2020-10-05'],
          [parse('October 13, 2020'), '2020-10-13'],
          [parse('October 26, 2020'), '2020-10-26'],
          [parse('November 3, 2020'), '2020-11-03'],
          [parse('December 1, 2020'), '2020-12-01'],
        ]

        expectations.forEach((ex) => expect(ex[0].toString()).toEqual(ex[1]))
      })

      it('throws when given invalid dates', () => {
        const parse = v1.parseUsaDateToNaiveIsoDate
        const fns = [
          () => parse('Friday, October 19, 2020'), // don't include weekday
          () => parse('october 19, 2020'), // month typo
          () => parse('October 19th, 2020'), // bad day
          () => parse('October 33, 2020'), // bad day (see dayjs/issues/320)
          () => parse('October 19 2020'), // punctuation
          () => parse('October 19, 2021'), // year not supported
          () => parse('October 19, 2019'), // year not supported
          () => parse('October 19, 1920'), // year not supported
          () => parse('October 19, 2120'), // year not supported
        ]

        fns.forEach((fn) => expect(fn).toThrow())
      })
    })

    describe('parseUsaLongDateToNaiveIsoDate', () => {
      it('parses dates', () => {
        const parse = v1.parseUsaLongDateToNaiveIsoDate
        const expectations = [
          [parse('Wednesday, January 1, 2020'), '2020-01-01'],
          [parse('Thursday, January 2, 2020'), '2020-01-02'],
          [parse('Tuesday, September 15, 2020'), '2020-09-15'],
          [parse('Monday, October 19, 2020'), '2020-10-19'],
          [parse('Sunday, October 4, 2020'), '2020-10-04'],
          [parse('Monday, October 5, 2020'), '2020-10-05'],
          [parse('Tuesday, October 13, 2020'), '2020-10-13'],
          [parse('Monday, October 26, 2020'), '2020-10-26'],
          [parse('Tuesday, November 3, 2020'), '2020-11-03'],
          [parse('Tuesday, December 1, 2020'), '2020-12-01'],
        ]

        expectations.forEach((ex) => expect(ex[0].toString()).toEqual(ex[1]))
      })

      it('throws when given invalid dates', () => {
        const parse = v1.parseUsaLongDateToNaiveIsoDate
        const fns = [
          () => parse('Friday, October 19, 2020'), // bad weekday
          () => parse('Mon, October 19, 2020'), // weekday typo
          () => parse('Monday, october 19, 2020'), // month typo
          () => parse('Monday, October 19th, 2020'), // bad day
          () => parse('Monday, October 33, 2020'), // bad day
          () => parse('Monday October 19, 2020'), // punctuation
          () => parse('Tuesday, October 19, 2021'), // year not supported
          () => parse('Sunday, October 19, 2019'), // year not supported
          () => parse('Tuesday, October 19, 1920'), // year not supported
          () => parse('Saturday, October 19, 2120'), // year not supported
        ]

        fns.forEach((fn) => expect(fn).toThrow())
      })
    })
  })
})
