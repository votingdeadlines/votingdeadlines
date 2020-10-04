import { parseVADeadlines } from './parseVoteAmericaDeadlines'
import { usaStates } from '../usaStates'

describe('parseVoteAmericaDeadlines.ts', () => {
  const mockCleanedData = `{ "Alaska": { "byMail": "received by October 13, 2020", "inPerson": "received by November 3, 2020", "online": "N/A" } }`
  const mockStates = usaStates.filter((s) => s.abbrev === 'AK')

  describe('parseVADeadlines', () => {
    it('works', () => {
      const result = parseVADeadlines(mockCleanedData, mockStates)

      expect(result).toEqual({
        AK: {
          inPersonRegPolicies: [
            {
              kind: 'InPersonRegDeadline',
              isoDate: '2020-11-03',
            },
          ],
          mailRegPolicies: [
            {
              kind: 'MailRegReceivedDeadline',
              isoDate: '2020-10-13',
            },
          ],
          onlineRegPolicies: [
            {
              kind: 'OnlineRegNotAvailable',
            },
          ],
        },
      })
    })
  })
})
