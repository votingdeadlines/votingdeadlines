import { resolve } from 'path'

import { readParseAndWriteHtml } from '../../src/parseHtml'

const {
  VOTEAMERICA_REG_RAW_HTML_PATH,
  VOTEAMERICA_REG_TABLE_SELECTOR,
  VOTEAMERICA_REG_TRIMMED_HTML_PATH,
} = process.env

const root = `${__dirname}/../..`
const rawPath = resolve(`${root}/${VOTEAMERICA_REG_RAW_HTML_PATH}`)
const trimmedPath = resolve(`${root}/${VOTEAMERICA_REG_TRIMMED_HTML_PATH}`)

readParseAndWriteHtml(rawPath, VOTEAMERICA_REG_TABLE_SELECTOR, trimmedPath)
