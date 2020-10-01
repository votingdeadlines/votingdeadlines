import { resolve } from 'path'

import { readParseAndWriteVGDeadlines } from '../../src/vote.gov/parseVoteGovDeadlines'

const { VOTE_GOV_CLEANED_JSON_PATH, VOTE_GOV_PARSED_JSON_PATH } = process.env

const root = `${__dirname}/../..`
const cleanedJsonPath = resolve(`${root}/${VOTE_GOV_CLEANED_JSON_PATH}`)
const parsedJsonPath = resolve(`${root}/${VOTE_GOV_PARSED_JSON_PATH}`)

readParseAndWriteVGDeadlines(cleanedJsonPath, parsedJsonPath)
