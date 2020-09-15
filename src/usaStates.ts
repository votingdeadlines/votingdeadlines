// This data was adapted from npmjs.com/package/usa-states (relevant file:
// https://github.com/nathanbarrett/usa-states/blob/master/src/usa-states.ts).
// The package seems to have a TypeScript issue that has not been fixed yet.

export type UsaState = {
  kind: 'state'
  name: string
  slug: string
  abbrev: string
}

export type UsaDistrict = {
  kind: 'district'
  name: string
  slug: string
  abbrev: string
}

function addSlug(entity) {
  return {
    ...entity,
    slug: entity.name.toLowerCase().replace(/ /g, '-'),
  }
}

export const usaStates: Array<UsaState> = [
  {
    kind: 'state',
    name: 'Alabama',
    abbrev: 'AL',
  },
  {
    kind: 'state',
    name: 'Alaska',
    abbrev: 'AK',
  },
  {
    kind: 'state',
    name: 'Arizona',
    abbrev: 'AZ',
  },
  {
    kind: 'state',
    name: 'Arkansas',
    abbrev: 'AR',
  },
  {
    kind: 'state',
    name: 'California',
    abbrev: 'CA',
  },
  {
    kind: 'state',
    name: 'Colorado',
    abbrev: 'CO',
  },
  {
    kind: 'state',
    name: 'Connecticut',
    abbrev: 'CT',
  },
  {
    kind: 'state',
    name: 'Delaware',
    abbrev: 'DE',
  },
  {
    kind: 'state',
    name: 'Florida',
    abbrev: 'FL',
  },
  {
    kind: 'state',
    name: 'Georgia',
    abbrev: 'GA',
  },
  {
    kind: 'state',
    name: 'Hawaii',
    abbrev: 'HI',
  },
  {
    kind: 'state',
    name: 'Idaho',
    abbrev: 'ID',
  },
  {
    kind: 'state',
    name: 'Illinois',
    abbrev: 'IL',
  },
  {
    kind: 'state',
    name: 'Indiana',
    abbrev: 'IN',
  },
  {
    kind: 'state',
    name: 'Iowa',
    abbrev: 'IA',
  },
  {
    kind: 'state',
    name: 'Kansas',
    abbrev: 'KS',
  },
  {
    kind: 'state',
    name: 'Kentucky',
    abbrev: 'KY',
  },
  {
    kind: 'state',
    name: 'Louisiana',
    abbrev: 'LA',
  },
  {
    kind: 'state',
    name: 'Maine',
    abbrev: 'ME',
  },
  {
    kind: 'state',
    name: 'Maryland',
    abbrev: 'MD',
  },
  {
    kind: 'state',
    name: 'Massachusetts',
    abbrev: 'MA',
  },
  {
    kind: 'state',
    name: 'Michigan',
    abbrev: 'MI',
  },
  {
    kind: 'state',
    name: 'Minnesota',
    abbrev: 'MN',
  },
  {
    kind: 'state',
    name: 'Mississippi',
    abbrev: 'MS',
  },
  {
    kind: 'state',
    name: 'Missouri',
    abbrev: 'MO',
  },
  {
    kind: 'state',
    name: 'Montana',
    abbrev: 'MT',
  },
  {
    kind: 'state',
    name: 'Nebraska',
    abbrev: 'NE',
  },
  {
    kind: 'state',
    name: 'Nevada',
    abbrev: 'NV',
  },
  {
    kind: 'state',
    name: 'New Hampshire',
    abbrev: 'NH',
  },
  {
    kind: 'state',
    name: 'New Jersey',
    abbrev: 'NJ',
  },
  {
    kind: 'state',
    name: 'New Mexico',
    abbrev: 'NM',
  },
  {
    kind: 'state',
    name: 'New York',
    abbrev: 'NY',
  },
  {
    kind: 'state',
    name: 'North Carolina',
    abbrev: 'NC',
  },
  {
    kind: 'state',
    name: 'North Dakota',
    abbrev: 'ND',
  },
  {
    kind: 'state',
    name: 'Ohio',
    abbrev: 'OH',
  },
  {
    kind: 'state',
    name: 'Oklahoma',
    abbrev: 'OK',
  },
  {
    kind: 'state',
    name: 'Oregon',
    abbrev: 'OR',
  },
  {
    kind: 'state',
    name: 'Pennsylvania',
    abbrev: 'PA',
  },
  {
    kind: 'state',
    name: 'Rhode Island',
    abbrev: 'RI',
  },
  {
    kind: 'state',
    name: 'South Carolina',
    abbrev: 'SC',
  },
  {
    kind: 'state',
    name: 'South Dakota',
    abbrev: 'SD',
  },
  {
    kind: 'state',
    name: 'Tennessee',
    abbrev: 'TN',
  },
  {
    kind: 'state',
    name: 'Texas',
    abbrev: 'TX',
  },
  {
    kind: 'state',
    name: 'Utah',
    abbrev: 'UT',
  },
  {
    kind: 'state',
    name: 'Vermont',
    abbrev: 'VT',
  },
  {
    kind: 'state',
    name: 'Virginia',
    abbrev: 'VA',
  },
  {
    kind: 'state',
    name: 'Washington',
    abbrev: 'WA',
  },
  {
    kind: 'state',
    name: 'West Virginia',
    abbrev: 'WV',
  },
  {
    kind: 'state',
    name: 'Wisconsin',
    abbrev: 'WI',
  },
  {
    kind: 'state',
    name: 'Wyoming',
    abbrev: 'WY',
  },
].map(addSlug)

const washingtonDc: UsaDistrict = addSlug({
  kind: 'district',
  name: 'District of Columbia',
  abbrev: 'DC',
})

export const usaStatesAndDc = [...usaStates, washingtonDc]

// const UsaTerritories: Array<UsaTerritory> = [
// {
//     kind: 'territory',
//     name: American Samoa,
//     abbrev: "AS",
// },
// {
//     kind: 'territory',
//     name: Federated States Of Micronesia,
//     abbrev: "FM",
// },
// {
//     kind: 'territory',
//     name: Guam,
//     abbrev: "GU",
// },
// {
//     kind: 'territory',
//     name: Marshall Islands,
//     abbrev: "MH",
// },
// {
//     kind: 'territory',
//     name: Northern Mariana Islands,
//     abbrev: "MP",
// },
// {
//     kind: 'territory',
//     name: Palau,
//     abbrev: "PW",
// },
// {
//     kind: 'territory',
//     name: Puerto Rico,
//     abbrev: "PR",
// },
// {
//     kind: 'territory',
//     name: Virgin Islands,
//     abbrev: "VI",
// },
// ].map(addSlug)

// TODO: DC

// TODO: territories?

// const top5SwingStates = ['FL', 'PA', 'WI', 'MI', 'AZ']
// const top10SwingStates = [...top5SwingStates, 'MN', 'NC', 'NV', 'CO', 'OH']
