import App from './App.svelte'
import * as datafile from './datafile'

const states = Object.entries(datafile.default)
const sortedStates = states.sort((state1: Array<any>, state2: Array<any>): number => {
  const onlineDate1 = state1[1].onlineRegPolicies.policies[0].isoDate
  const onlineDate2 = state2[1].onlineRegPolicies.policies[0].isoDate
  return onlineDate1 > onlineDate2 ? 1 : -1
})

const sortedMap = sortedStates.reduce((memo, stateEntry) => {
  memo[stateEntry[0]] = stateEntry[1]
  return memo
}, {})

const app = new App({
  target: document.body,
  props: {
    statesAndDc: sortedMap
  },
})

export default app
