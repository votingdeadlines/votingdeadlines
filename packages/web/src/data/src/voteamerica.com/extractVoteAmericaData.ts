import { parseHtmlV2 } from '../parseHtml'
import { logProgress, readFile, writeFile } from '../utilities'

interface RawVAData {
  [key: string]: {
    byMail: string
    inPerson: string
    online: string
  }
}

export function extractVAData(html: string): RawVAData {
  // These selectors are a bit wonky given there isn't a parent element
  // that has the state, which would make it easier to select the children.
  const stateRowsSelector = 'tbody > tr'
  const stateRowsNodes = parseHtmlV2(html, stateRowsSelector)

  const rawData = Array.from(stateRowsNodes).reduce(
    (memo: RawVAData, stateRowsNode: HTMLTableRowElement, i): RawVAData => {
      // jsdom seems to dislike parsing a <tr> by itself.
      const fakeTable = `<table>${stateRowsNode.outerHTML}</table>`


      // This is based on the order of the columns; double check the order.
      const stateCell = parseHtmlV2(fakeTable, 'td:nth-child(1)')[0]
      const bmCell = parseHtmlV2(fakeTable, 'td:nth-child(2)')[0]
      const ipCell = parseHtmlV2(fakeTable, 'td:nth-child(3)')[0]
      const olCell = parseHtmlV2(fakeTable, 'td:nth-child(4)')[0]

      const stateName = stateCell.textContent.trim()
      const registrationDeadlines = {
        byMail: bmCell.textContent.trim(),
        inPerson: ipCell.textContent.trim(),
        online: olCell.textContent.trim(),
      }

      logProgress('Extract VoteAmerica:', stateName, i)
      memo[stateName] = registrationDeadlines

      return memo
    },
    {}
  )

  return rawData
}

// Reads an HTML file and writes it as JSON data.
export function readExtractAndWriteVAData(
  inputPath: string,
  outputPath: string
): void {
  const html = readFile(inputPath)
  const rawData = extractVAData(html)
  const rawJson = JSON.stringify(rawData, null, 2)
  writeFile(outputPath, rawJson)
}
