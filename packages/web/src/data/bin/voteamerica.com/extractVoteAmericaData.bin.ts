import { resolve } from 'path'

import { readExtractAndWriteVAData } from '../../src/voteamerica.com/extractVoteAmericaData'
import { readExtractAndWriteVARegStatusData } from '../../src/voteamerica.com/extractVoteAmericaRegStatusData'

const {
  VOTEAMERICA_REG_FORMATTED_HTML_PATH,
  VOTEAMERICA_REG_STATUS_FORMATTED_HTML_PATH,
  VOTEAMERICA_REG_RAW_JSON_PATH,
  VOTEAMERICA_REG_STATUS_RAW_JSON_PATH,
} = process.env

if (!VOTEAMERICA_REG_FORMATTED_HTML_PATH || !VOTEAMERICA_REG_RAW_JSON_PATH) {
  throw new Error('Missing variables in extractVoteAmericaData.bin.ts.')
}

if (!VOTEAMERICA_REG_STATUS_FORMATTED_HTML_PATH || !VOTEAMERICA_REG_STATUS_RAW_JSON_PATH) {
  throw new Error('Missing variables in extractVoteAmericaData.bin.ts.')
}

const root = `${__dirname}/../..`
const regFormattedPath = resolve(`${root}/${VOTEAMERICA_REG_FORMATTED_HTML_PATH}`)
const regRawJsonPath = resolve(`${root}/${VOTEAMERICA_REG_RAW_JSON_PATH}`)

readExtractAndWriteVAData(regFormattedPath, regRawJsonPath)

const statusFormattedPath = resolve(`${root}/${VOTEAMERICA_REG_STATUS_FORMATTED_HTML_PATH}`)
const statusRawJsonPath = resolve(`${root}/${VOTEAMERICA_REG_STATUS_RAW_JSON_PATH}`)

readExtractAndWriteVARegStatusData(statusFormattedPath, statusRawJsonPath)
