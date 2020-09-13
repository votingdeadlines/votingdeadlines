import { resolve } from 'path'

import { readParseAndWriteHtml } from '../src/parseHtml'

const {
  VOTE_ORG_GENERAL_RAW_HTML_PATH,
  VOTE_ORG_GENERAL_TABLE_SELECTOR,
  VOTE_ORG_GENERAL_TRIMMED_HTML_PATH,
} = process.env

const generalRawHtmlPath = resolve(
  `${__dirname}/../${VOTE_ORG_GENERAL_RAW_HTML_PATH}`
)
const generalTrimmedPath = resolve(
  `${__dirname}/../${VOTE_ORG_GENERAL_TRIMMED_HTML_PATH}`
)

readParseAndWriteHtml(
  generalRawHtmlPath,
  VOTE_ORG_GENERAL_TABLE_SELECTOR,
  generalTrimmedPath
)
