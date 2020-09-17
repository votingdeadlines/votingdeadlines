import { resolve } from 'path'

import { readCleanAndWriteVGData } from '../src/cleanVoteGovData'

const { VOTE_GOV_RAW_JSON_PATH, VOTE_GOV_CLEANED_JSON_PATH } = process.env

const rawJsonPath = resolve(`${__dirname}/../${VOTE_GOV_RAW_JSON_PATH}`)
const cleanedJsonPath = resolve(`${__dirname}/../${VOTE_GOV_CLEANED_JSON_PATH}`)

readCleanAndWriteVGData(rawJsonPath, cleanedJsonPath)
