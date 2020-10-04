# Glossary

> An incomplete guide to interpreting various identifier names/fragments.

## `FinalDeadline`

* The last (furthest into the future) deadline a state has for registration.

## `MergedStateReg`

* [State] data specific to registration policies, merged from multiple sources.

## `MergedStateRegIndex`

* A map of state abbreviations to [MergedStateReg] data, e.g. `{ AK: ak }`.

## `StateEntries`

* An array of the form `[["AK", ak], ...]` created via `Object.entries(index)`.

## `StateIndex`

* A map of state abbreviations to data, e.g. `{ AK: ak, ... }`

## `State`

* A single state or state-like jurisdiction (i.e. DC).

## `VDState`

* A class that encapsulates a single [state]'s data plus convenience methods.

## `VDStateIndex`

* A class that encapsulates an [index] of [state] data plus convenience methods.