import { resolve } from 'path'

import { readAndWriteVAData } from '../../src/voteamerica.com/cleanVoteAmericaData'

const {
  VOTEAMERICA_REG_RAW_JSON_PATH,
  VOTEAMERICA_REG_CLEANED_JSON_PATH,
} = process.env

const root = `${__dirname}/../..`
const rawJsonPath = resolve(`${root}/${VOTEAMERICA_REG_RAW_JSON_PATH}`)
const cleanedJsonPath = resolve(`${root}/${VOTEAMERICA_REG_CLEANED_JSON_PATH}`)

readAndWriteVAData(rawJsonPath, cleanedJsonPath)
