// This data is already pretty clean, so all this file does it copy it over.
// It also defines what the data should look like for other files to import.

import { readFile, writeFile } from './utilities'

//-------//
// Types //
//-------//

export type CleanVADataset = {
  [key: string]: CleanVAState
}

export type CleanVAState = {
  byMail: string
  inPerson: string
  online: string
}

//-----//
// I/O //
//-----//

// Reads VoteAmerica.com raw JSON data and copies it to the "cleaned" location.
export function readAndWriteVAData(
  inputPath: string,
  outputPath: string
  // entities = usaStates
): void {
  const rawJson = readFile(inputPath)
  const data: CleanVADataset = JSON.parse(rawJson)
  const json = JSON.stringify(data, null, 2)
  writeFile(outputPath, json)
}
