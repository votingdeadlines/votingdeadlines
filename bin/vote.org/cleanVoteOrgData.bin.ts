import { resolve } from 'path'

import { readCleanAndWriteVoteOrgData } from '../../src/vote.org/cleanVoteOrgData'

const {
  VOTE_ORG_GENERAL_RAW_JSON_PATH,
  VOTE_ORG_GENERAL_CLEANED_JSON_PATH,
} = process.env

const generalRawJsonPath = resolve(
  `${__dirname}/../../${VOTE_ORG_GENERAL_RAW_JSON_PATH}`
)
const generalCleanedJsonPath = resolve(
  `${__dirname}/../../${VOTE_ORG_GENERAL_CLEANED_JSON_PATH}`
)

readCleanAndWriteVoteOrgData(generalRawJsonPath, generalCleanedJsonPath)
