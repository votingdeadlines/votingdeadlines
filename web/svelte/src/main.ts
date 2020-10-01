import App from './App.svelte'
import * as datafile from './datafile'
import * as statesOrder from './statesOrder'
import {
  getOnlineDeadlineUiDates,
  getInPersonDeadlineUiDates,
  getMailDeadlineUiDates,
} from './stateUtilities'
import { v2 } from './clientTimeUtilities'

const timeNow = v2.now()

const states = Object.entries(datafile.default)

const filteredStates = states.filter((state) => true)

const statesIndices = {}

function sortStates(state1, state2): number {
  const abbrev1 = state1[0]
  const abbrev2 = state2[0]

  // Get index of state1 (lookup)
  const index1 = statesIndices[abbrev1] || statesOrder.default.indexOf(abbrev1)
  const index2 = statesIndices[abbrev2] || statesOrder.default.indexOf(abbrev2)

  // Add to statesIndices
  statesIndices[abbrev1] = index1
  statesIndices[abbrev2] = index2

  if (index1 > index2) return 1
  if (index1 < index2) return -1
  throw new Error('Could not compare state indices.')
}

console.log('Sorting...')
const sortStart = Date.now()
const sortedStates = filteredStates.sort(sortStates)
const sortEnd = Date.now()
const sortTime = sortEnd - sortStart
console.log(`Done in ${sortTime}ms.`)

const app = new App({
  target: document.body,
  props: {
    statesAndDc: sortedStates,
    timeNow,
  },
})

export default app
