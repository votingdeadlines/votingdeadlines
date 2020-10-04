import { resolve } from 'path'

import { readParseAndWriteVADeadlines } from '../../src/voteamerica.com/parseVoteAmericaDeadlines'

const {
  VOTEAMERICA_REG_CLEANED_JSON_PATH,
  VOTEAMERICA_REG_PARSED_JSON_PATH,
} = process.env

const root = `${__dirname}/../..`
const cleanedJsonPath = resolve(`${root}/${VOTEAMERICA_REG_CLEANED_JSON_PATH}`)
const parsedJsonPath = resolve(`${root}/${VOTEAMERICA_REG_PARSED_JSON_PATH}`)

readParseAndWriteVADeadlines(cleanedJsonPath, parsedJsonPath)
