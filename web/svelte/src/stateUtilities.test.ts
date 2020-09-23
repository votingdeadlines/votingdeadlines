import type { ClientStateData } from './clientTypes'
import {
  getOnlineUiBooleans,
  getInPersonUiBooleans,
  getMailUiBooleans
} from './stateUtilities'

describe('stateUtilities.ts', () => {
  describe('getOnlineUiBooleans', () => {
    it('returns correct booleans when online reg. is unavailable', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: {
          policies: [{ kind: 'OnlineRegNotAvailable' }],
          warnings: [],
        },
        inPersonRegPolicies: { policies: [], warnings: [] },
        mailRegPolicies: { policies: [], warnings: [] }
      }
      const result = getOnlineUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isCountdown: false,
        isNotAvailable: true,
        isUnsure: false,
        isBug: false,
      })
    })

    it('returns correct booleans when online reg. is available', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: {
          policies: [{ kind: 'OnlineRegDeadline', isoDate: 'isoDate' }],
          warnings: [],
        },
        inPersonRegPolicies: { policies: [], warnings: [] },
        mailRegPolicies: { policies: [], warnings: [] }
      }
      const result = getOnlineUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isCountdown: true,
        isNotAvailable: false,
        isUnsure: false,
        isBug: false,
      })
    })
  })

  describe('getInPersonUiBooleans', () => {
    it('returns correct booleans when in person reg. is unavailable', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: { policies: [], warnings: [] },
        inPersonRegPolicies: {
          policies: [{ kind: 'InPersonRegNotAvailable' }],
          warnings: [],
        },
        mailRegPolicies: { policies: [], warnings: [] }
      }
      const result = getInPersonUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isCountdown: false,
        isNotAvailable: true,
        isUnsure: false,
        isBug: false,
      })
    })

    it('returns correct booleans when in person reg. is available', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: { policies: [], warnings: [] },
        inPersonRegPolicies: {
          policies: [{ kind: 'InPersonRegDeadline', isoDate: 'isoDate' }],
          warnings: [],
        },
        mailRegPolicies: { policies: [], warnings: [] }
      }
      const result = getInPersonUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isCountdown: true,
        isNotAvailable: false,
        isUnsure: false,
        isBug: false,
      })
    })
  })

  describe('getMailUiBooleans', () => {
    it('returns correct booleans when mail reg. is unavailable', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: { policies: [], warnings: [] },
        inPersonRegPolicies: { policies: [], warnings: [] },
        mailRegPolicies: {
          policies: [{ kind: 'MailRegNotAvailable' }],
          warnings: [],
        },
      }
      const result = getMailUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isPostmarkedCountdown: false,
        isReceivedCountdown: false,
        isNotAvailable: true,
        isUnsure: false,
        isBug: false,
      })
    })

    it('returns correct booleans when mail reg. is postmarked by', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: { policies: [], warnings: [] },
        inPersonRegPolicies: { policies: [], warnings: [] },
        mailRegPolicies: {
          policies: [{ kind: 'MailRegPostmarkedDeadline', isoDate: 'isoDate' }],
          warnings: [],
        },
      }
      const result = getMailUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isPostmarkedCountdown: true,
        isReceivedCountdown: false,
        isNotAvailable: false,
        isUnsure: false,
        isBug: false,
      })
    })

    it('returns correct booleans when mail reg. is received by', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: { policies: [], warnings: [] },
        inPersonRegPolicies: { policies: [], warnings: [] },
        mailRegPolicies: {
          policies: [{ kind: 'MailRegReceivedDeadline', isoDate: 'isoDate' }],
          warnings: [],
        },
      }
      const result = getMailUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isPostmarkedCountdown: false,
        isReceivedCountdown: true,
        isNotAvailable: false,
        isUnsure: false,
        isBug: false,
      })
    })

    it('returns unsure if there are multiple mail deadlines', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: { policies: [], warnings: [] },
        inPersonRegPolicies: { policies: [], warnings: [] },
        mailRegPolicies: {
          policies: [
            { kind: 'MailRegPostmarkedDeadline', isoDate: 'isoDate' },
            { kind: 'MailRegReceivedDeadline', isoDate: 'isoDate' },
          ],
          warnings: [],
        },
      }
      const result = getMailUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isPostmarkedCountdown: false,
        isReceivedCountdown: false,
        isNotAvailable: false,
        isUnsure: true,
        isBug: false,
      })
    })

    it('returns unsure if there are no mail deadlines', () => {
      const mockStateData: ClientStateData = {
        onlineRegPolicies: { policies: [], warnings: [] },
        inPersonRegPolicies: { policies: [], warnings: [] },
        mailRegPolicies: { policies: [], warnings: [] },
      }
      const result = getMailUiBooleans(mockStateData)

      expect(result).toStrictEqual({
        isPostmarkedCountdown: false,
        isReceivedCountdown: false,
        isNotAvailable: false,
        isUnsure: true,
        isBug: false,
      })
    })
  })
})
