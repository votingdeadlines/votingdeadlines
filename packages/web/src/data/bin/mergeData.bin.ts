import { resolve } from 'path'

import { readMergeAndWriteVGAndVAData } from '../src/mergeData'

const {
  VOTE_GOV_PARSED_JSON_PATH,
  VOTEAMERICA_REG_PARSED_JSON_PATH,
  MERGED_DATA_JSON_PATH,
} = process.env

const root = `${__dirname}/..`
const vgJsonPath = resolve(`${root}/${VOTE_GOV_PARSED_JSON_PATH}`)
const vaDataPath = resolve(`${root}/${VOTEAMERICA_REG_PARSED_JSON_PATH}`)
const mergedJsonPath = resolve(`${root}/${MERGED_DATA_JSON_PATH}`)

readMergeAndWriteVGAndVAData(vgJsonPath, vaDataPath, mergedJsonPath)
