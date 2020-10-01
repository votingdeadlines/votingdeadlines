import { resolve } from 'path'

import { readExtractAndWriteVoteOrgData } from '../../src/vote.org/extractVoteOrgData'

const {
  VOTE_ORG_GENERAL_FORMATTED_HTML_PATH,
  VOTE_ORG_GENERAL_RAW_JSON_PATH,
} = process.env

const generalFormattedHtmlPath = resolve(
  `${__dirname}/../../${VOTE_ORG_GENERAL_FORMATTED_HTML_PATH}`
)
const generalRawJsonPath = resolve(
  `${__dirname}/../../${VOTE_ORG_GENERAL_RAW_JSON_PATH}`
)

readExtractAndWriteVoteOrgData(generalFormattedHtmlPath, generalRawJsonPath)
