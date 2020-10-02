import * as repl from 'repl'
import { VD_FIXTURE, VDStateIndex } from './State/State'
import * as data from '../data/votingDeadlines.json'
import type { MergedStateRegIndex } from './mergeData'

// Start
const replServer = repl.start({})

// Data & code
replServer.context.data = data
replServer.context.VDStateIndex = VDStateIndex
replServer.context.index = VDStateIndex.fromMap(data as MergedStateRegIndex)

// Fixtures for testing
replServer.context.VD_FIXTURE = VD_FIXTURE
replServer.context.fixture = new VDStateIndex(VD_FIXTURE)
