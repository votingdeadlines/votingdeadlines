import { default as data } from './votingDeadlines.json'

describe('votingDeadlines.json', () => {
  const dataKeys = Object.keys(data)

  it('has 51 entities', () => {
    expect(dataKeys.length).toBe(51)
  })

  describe('snapshot', () => {
    // This acts as a safeguard or two-step verification for data changes.
    // If the underlying data in this file changes, the test will fail. Run
    // `make update-snapshots` or `make upss` to confirm the change.
    it('matches snapshot', () => {
      expect(data).toMatchSnapshot();
    })
  })
})
