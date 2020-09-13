import { resolve } from 'path'

import { readParseAndWriteHtml } from '../src/parseHtml'

const { VOTE_ORG_GENERAL_RAW_HTML_PATH, VOTE_ORG_GENERAL_TABLE_SELECTOR, VOTE_ORG_GENERAL_TRIMMED_HTML_PATH } = process.env

const voteOrgGeneralRawHtmlPath = resolve(`${__dirname}/../${VOTE_ORG_GENERAL_RAW_HTML_PATH}`)
const voteOrgGeneralTrimmedPath = resolve(`${__dirname}/../${VOTE_ORG_GENERAL_TRIMMED_HTML_PATH}`)

readParseAndWriteHtml(voteOrgGeneralRawHtmlPath, VOTE_ORG_GENERAL_TABLE_SELECTOR, voteOrgGeneralTrimmedPath)
