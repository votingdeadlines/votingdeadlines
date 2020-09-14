import { usaStates, usaStatesAndDc } from './usaStates'

describe('usaStates.ts', () => {
  describe('usaStates', () => {
    it('seem legit', () => {
      expect(usaStates.length).toBe(50)
    })
  })

  describe('usaStatesAndDc', () => {
    it('seem legit', () => {
      expect(usaStatesAndDc.length).toBe(51)
    })
  })
})
