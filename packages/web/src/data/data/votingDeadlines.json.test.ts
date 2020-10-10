import { default as data } from './votingDeadlines.json'

describe('votingDeadlines.json', () => {
  const dataKeys = Object.keys(data)

  it('has 51 entities', () => {
    expect(dataKeys.length).toBe(51)
  })
})
