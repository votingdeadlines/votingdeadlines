import type { MergedStateRegIndex } from './mergeData'
import { UsaState, usaStatesAndDc } from './usaStates'
import { readFile, writeFile } from './utilities'

//-------//
// Types //
//-------//

// No new types – just add new properties as optional keys in MergedStateReg.

//---------------//
// Merge methods //
//---------------//

// Merge check status links into existing merged data.
function mergeStateIndexRegStatus(
  mergedDataJson: string,
  regStatusDataJson: string,
  entities = usaStatesAndDc
): MergedStateRegIndex {
  const mergedData: MergedStateRegIndex = JSON.parse(mergedDataJson)
  const regStatusData = JSON.parse(regStatusDataJson)

  const remergedData = entities.reduce(
    (
      memo: MergedStateRegIndex,
      state: UsaState,
      i: number
    ): MergedStateRegIndex => {
      const mergedState = mergedData[state.abbrev]
      const regStatusLink = regStatusData[state.abbrev]

      console.log(`${'.'.repeat(i)}${state.abbrev}`)
      if (!regStatusLink) {
        throw new Error(`Could not find state ${state.abbrev} in status data.`)
      }

      memo[state.abbrev] = {
        ...mergedState,
        checkRegStatusLink: regStatusLink,
      }

      return memo
    },
    {}
  )

  return remergedData
}

//-----//
// I/O //
//-----//

// Reads cleaned JSON data, tries to parse it, and writes the result.
export function readMergeAndWriteRegStatusData(
  mergedDataPath: string,
  regStatusDataPath: string,
  outputPath: string,
  entities = usaStatesAndDc
): void {
  const mergedDataJson = readFile(mergedDataPath)
  const regStatusDataJson = readFile(regStatusDataPath)
  const remergedData = mergeStateIndexRegStatus(mergedDataJson, regStatusDataJson, entities)
  const remergedJson = JSON.stringify(remergedData, null, 2)
  writeFile(outputPath, remergedJson)
}
