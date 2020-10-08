import { resolve } from 'path'

import { readParseAndWriteHtml } from '../../src/parseHtml'

const {
  VOTEAMERICA_REG_RAW_HTML_PATH,
  VOTEAMERICA_REG_STATUS_RAW_HTML_PATH,
  VOTEAMERICA_REG_TABLE_SELECTOR,
  VOTEAMERICA_REG_STATUS_TABLE_SELECTOR,
  VOTEAMERICA_REG_TRIMMED_HTML_PATH,
  VOTEAMERICA_REG_STATUS_TRIMMED_HTML_PATH,
} = process.env

const root = `${__dirname}/../..`
const regRawPath = resolve(`${root}/${VOTEAMERICA_REG_RAW_HTML_PATH}`)
const statusRawPath = resolve(`${root}/${VOTEAMERICA_REG_STATUS_RAW_HTML_PATH}`)
const regTrimmedPath = resolve(`${root}/${VOTEAMERICA_REG_TRIMMED_HTML_PATH}`)
const statusTrimmedPath = resolve(
  `${root}/${VOTEAMERICA_REG_STATUS_TRIMMED_HTML_PATH}`
)

readParseAndWriteHtml(
  regRawPath,
  VOTEAMERICA_REG_TABLE_SELECTOR,
  regTrimmedPath
)
readParseAndWriteHtml(
  statusRawPath,
  VOTEAMERICA_REG_STATUS_TABLE_SELECTOR,
  statusTrimmedPath
)
