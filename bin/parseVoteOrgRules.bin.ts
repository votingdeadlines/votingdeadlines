import { resolve } from 'path'

import { readParseAndWriteVORules } from '../src/parseVoteOrgRules'

const {
  VOTE_ORG_GENERAL_CLEANED_JSON_PATH,
  VOTE_ORG_GENERAL_PARSED_JSON_PATH,
} = process.env

const generalCleanedJsonPath = resolve(
  `${__dirname}/../${VOTE_ORG_GENERAL_CLEANED_JSON_PATH}`
)
const generalParsedJsonPath = resolve(
  `${__dirname}/../${VOTE_ORG_GENERAL_PARSED_JSON_PATH}`
)

readParseAndWriteVORules(generalCleanedJsonPath, generalParsedJsonPath)
