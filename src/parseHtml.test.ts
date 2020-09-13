const mockInputHtml = '<html><body><main>Hello world</main></body></html>'
const mockReadFileSync = jest.fn().mockImplementation(() => mockInputHtml)
const mockWriteFileSync = jest.fn()
jest.mock('fs', () => ({
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
}))

import { parseHtml, readAndParseHtml, readParseAndWriteHtml } from './parseHtml'

describe('parseHtml.ts', () => {
  describe('parseHtml', () => {
    it('works', () => {
      const result = parseHtml('<html><body /></html>', 'body')

      expect(result).toBe('<body></body>')
    })
  })

  describe('readAndParseHtml', () => {
    it('works', () => {
      const result = readAndParseHtml('/foo/index.html', 'main')

      expect(result).toBe('<main>Hello world</main>')
    })
  })

  describe('readParseAndWriteHtml', () => {
    it('works', () => {
      readParseAndWriteHtml('/foo/index.html', 'main', '/bar/output.html')

      expect(mockWriteFileSync).toHaveBeenCalledTimes(1)
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/bar/output.html',
        '<main>Hello world</main>'
      )
    })
  })
})
