const mockInputJson = `{ "AL": "In Person:\\n            15 days before Election Day.\\n          \\n          \\n            By Mail:\\n            Postmarked 15 days before Election Day.\\n          \\n          \\n            Online:\\n            15 days before Election Day." }`
const mockReadFileSync = jest.fn().mockImplementation(() => mockInputJson)
const mockWriteFileSync = jest.fn()
jest.mock('fs', () => ({
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
}))

import {
  cleanVoteOrgData,
  readCleanAndWriteVoteOrgData,
} from './cleanVoteOrgData'
import { usaStates } from '../usaStates'

describe('cleanVoteOrgData.ts', () => {
  const mockStates = usaStates.filter((s) => s.abbrev === 'AL')

  describe('cleanVoteOrgData', () => {
    it('works', () => {
      const result = cleanVoteOrgData(mockInputJson, mockStates)

      expect(result).toEqual({
        AL: {
          InPerson: '15 days before Election Day.',
          ByMail: 'Postmarked 15 days before Election Day.',
          Online: '15 days before Election Day.',
        },
      })
    })
  })

  describe('readCleanAndWriteVoteOrgData', () => {
    it('works', () => {
      readCleanAndWriteVoteOrgData(
        '/foo/raw.json',
        '/bar/output.json',
        mockStates
      )

      expect(mockWriteFileSync).toHaveBeenCalledTimes(1)
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/bar/output.json',
        `
{
  "AL": {
    "InPerson": "15 days before Election Day.",
    "ByMail": "Postmarked 15 days before Election Day.",
    "Online": "15 days before Election Day."
  }
}
        `.trim()
      )
    })
  })
})
