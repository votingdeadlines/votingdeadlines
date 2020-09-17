import * as rawStateData from './state-data.raw.json'
import * as cleanedStateData from './state-data.cleaned.json'
import * as parsedStateData from './state-data.cleaned.json'

describe('vote.gov', () => {
  const rawKeys = Object.keys(rawStateData)
  const cleanedKeys = Object.keys(cleanedStateData)
  const parsedKeys = Object.keys(parsedStateData)

  describe('raw data', () => {
    it('has 56 entities (includes territories)', () => {
      expect(rawKeys.length).toBe(56)
    })
  })

  describe('cleaned data', () => {
    it('has 51 entities', () => {
      expect(cleanedKeys.length).toBe(51)
    })
  })

  describe('parsed data', () => {
    it('has 51 entities', () => {
      expect(parsedKeys.length).toBe(51)
    })
  })
})
