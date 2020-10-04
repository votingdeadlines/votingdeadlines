import { resolve } from 'path'

import { readExtractAndWriteVAData } from '../../src/voteamerica.com/extractVoteAmericaData'

const {
  VOTEAMERICA_REG_FORMATTED_HTML_PATH,
  VOTEAMERICA_REG_RAW_JSON_PATH,
} = process.env

if (!VOTEAMERICA_REG_FORMATTED_HTML_PATH || !VOTEAMERICA_REG_RAW_JSON_PATH) {
  throw new Error('Missing variables in extractVoteAmericaData.bin.ts.')
}

const root = `${__dirname}/../..`
const formattedPath = resolve(`${root}/${VOTEAMERICA_REG_FORMATTED_HTML_PATH}`)
const rawJsonPath = resolve(`${root}/${VOTEAMERICA_REG_RAW_JSON_PATH}`)

readExtractAndWriteVAData(formattedPath, rawJsonPath)
