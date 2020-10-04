import * as repl from 'repl'
import { VD_FIXTURE, VDStateIndex } from './models/State'
import * as data from '../data/votingDeadlines.json'
import type { MergedStateRegIndex } from './mergeData'

// Start
const replServer = repl.start({})

// Data & code
replServer.context.data = data
replServer.context.VDStateIndex = VDStateIndex
const index = VDStateIndex.fromMap(data as MergedStateRegIndex)
replServer.context.index = index
replServer.context.ak = index.states.find(s => s.abbrev === 'AK')

// Fixtures for testing
replServer.context.VD_FIXTURE = VD_FIXTURE
replServer.context.fixture = new VDStateIndex(VD_FIXTURE)
