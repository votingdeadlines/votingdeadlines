// import App from './App.svelte'
// import * as datafile from './datafile'
// import { getOnlineDeadlineUiDates, getInPersonDeadlineUiDates, getMailDeadlineUiDates } from './stateUtilities'
// import { v2 } from './clientTimeUtilities'

// const timeNow = v2.now()

// const states = Object.entries(datafile.default)

// const filteredStates = states.filter(state => {
//   return true
// })

// export function sortStates(state1, state2): number {
//   console.log(`Sorting ${state1[0]}, ${state2[0]}`)
//   // First, let's get all the `dates` objects so we can compare stuff.
//   const datesArray1 = [
//     getOnlineDeadlineUiDates(state1[1], timeNow),
//     getInPersonDeadlineUiDates(state1[1], timeNow),
//     getMailDeadlineUiDates(state1[1], timeNow),
//   ].filter(dates => dates)
//   const datesArray2 = [
//     getOnlineDeadlineUiDates(state2[1], timeNow),
//     getInPersonDeadlineUiDates(state2[1], timeNow),
//     getMailDeadlineUiDates(state2[1], timeNow),
//   ].filter(dates => dates)

//   // We mostly just care about how much time is left to register.
//   const countdowns1 = datesArray1.map(dates => dates.mainCountdown)
//   const countdowns2 = datesArray2.map(dates => dates.mainCountdown)

//   // We mostly just care about countdowns that haven't totally expired yet.
//   function filterActiveCountdowns(duration): boolean {
//     // See comments on colorUtilities#getStateColorDefault. Basically the
//     // countdown reach 0 at the beginning of the final day, so if we want to
//     // keep considering a countdown active on its final day, we should check
//     // both ms and days.
//     const { days, signedMs } = duration
//     const isBeforeFinalDay = signedMs > 0
//     const isFinalDay = signedMs < 0 && days === 0
//     return isBeforeFinalDay || isFinalDay
//   }
//   const activeCoundowns1 = countdowns1.filter(filterActiveCountdowns)
//   const activeCoundowns2 = countdowns2.filter(filterActiveCountdowns)
//   const activeCoundowns1Ms = activeCoundowns1.map(d => d.signedMs)
//   const activeCoundowns2Ms = activeCoundowns2.map(d => d.signedMs)
//   console.log(activeCoundowns1Ms, activeCoundowns2Ms)

//   // Before we do the math comparisons, it's easier to reason about if we just
//   // eliminate the empty array cases explicitly. Basically ND goes to the end.
//   if (!activeCoundowns1Ms.length && activeCoundowns2Ms.length) return 1
//   if (!activeCoundowns2Ms.length && activeCoundowns1Ms.length) return -1

//   // Among countdowns that haven't expired, we want the latest (last chance).
//   const maxActiveCountdown1 = Math.max(...activeCoundowns1Ms)
//   const maxActiveCountdown2 = Math.max(...activeCoundowns2Ms)

//   console.log(maxActiveCountdown1, maxActiveCountdown2)

//   if (maxActiveCountdown1 < maxActiveCountdown2) return -1
//   if (maxActiveCountdown1 > maxActiveCountdown2) return 1

//   // If they are equal, break ties on the minimum.
//   const minActiveCountdown1 = Math.min(...activeCoundowns1Ms)
//   const minActiveCountdown2 = Math.min(...activeCoundowns2Ms)
//   if (minActiveCountdown1 < minActiveCountdown2) return -1
//   if (minActiveCountdown1 > minActiveCountdown2) return 1

//   return 0
// }

// const sortedStates = filteredStates.sort(sortStates)
