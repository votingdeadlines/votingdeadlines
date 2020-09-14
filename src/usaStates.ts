// This data was copied from npmjs.com/package/usa-states (relevant file:
// https://github.com/nathanbarrett/usa-states/blob/master/src/usa-states.ts).
// The package seems to have a TypeScript issue that has not been fixed yet.

export interface UsaEntity {
  name: string
  slug: string
  abbrev: string
  isState?: boolean
  isDistrict?: boolean // DC
  isTerritory?: boolean
}

const usaEntities: Array<UsaEntity> = [
  {
    name: 'Alabama',
    abbrev: 'AL',
    isState: true,
  },
  {
    name: 'Alaska',
    abbrev: 'AK',
    isState: true,
  },
  // {
  //     name: "American Samoa",
  //     abbrev: "AS",
  //     isTerritory: true,
  // },
  {
    name: 'Arizona',
    abbrev: 'AZ',
    isState: true,
  },
  {
    name: 'Arkansas',
    abbrev: 'AR',
    isState: true,
  },
  {
    name: 'California',
    abbrev: 'CA',
    isState: true,
  },
  {
    name: 'Colorado',
    abbrev: 'CO',
    isState: true,
  },
  {
    name: 'Connecticut',
    abbrev: 'CT',
    isState: true,
  },
  {
    name: 'Delaware',
    abbrev: 'DE',
    isState: true,
  },
  {
    name: 'District Of Columbia',
    abbrev: 'DC',
    isDistrict: true,
  },
  // {
  //     name: "Federated States Of Micronesia",
  //     abbrev: "FM",
  //     isTerritory: true,
  // },
  {
    name: 'Florida',
    abbrev: 'FL',
    isState: true,
  },
  {
    name: 'Georgia',
    abbrev: 'GA',
    isState: true,
  },
  // {
  //     name: "Guam",
  //     abbrev: "GU",
  //     isTerritory: true,
  // },
  {
    name: 'Hawaii',
    abbrev: 'HI',
    isState: true,
  },
  {
    name: 'Idaho',
    abbrev: 'ID',
    isState: true,
  },
  {
    name: 'Illinois',
    abbrev: 'IL',
    isState: true,
  },
  {
    name: 'Indiana',
    abbrev: 'IN',
    isState: true,
  },
  {
    name: 'Iowa',
    abbrev: 'IA',
    isState: true,
  },
  {
    name: 'Kansas',
    abbrev: 'KS',
    isState: true,
  },
  {
    name: 'Kentucky',
    abbrev: 'KY',
    isState: true,
  },
  {
    name: 'Louisiana',
    abbrev: 'LA',
    isState: true,
  },
  {
    name: 'Maine',
    abbrev: 'ME',
    isState: true,
  },
  // {
  //     name: "Marshall Islands",
  //     abbrev: "MH",
  //     isTerritory: true,
  // },
  {
    name: 'Maryland',
    abbrev: 'MD',
    isState: true,
  },
  {
    name: 'Massachusetts',
    abbrev: 'MA',
    isState: true,
  },
  {
    name: 'Michigan',
    abbrev: 'MI',
    isState: true,
  },
  {
    name: 'Minnesota',
    abbrev: 'MN',
    isState: true,
  },
  {
    name: 'Mississippi',
    abbrev: 'MS',
    isState: true,
  },
  {
    name: 'Missouri',
    abbrev: 'MO',
    isState: true,
  },
  {
    name: 'Montana',
    abbrev: 'MT',
    isState: true,
  },
  {
    name: 'Nebraska',
    abbrev: 'NE',
    isState: true,
  },
  {
    name: 'Nevada',
    abbrev: 'NV',
    isState: true,
  },
  {
    name: 'New Hampshire',
    abbrev: 'NH',
    isState: true,
  },
  {
    name: 'New Jersey',
    abbrev: 'NJ',
    isState: true,
  },
  {
    name: 'New Mexico',
    abbrev: 'NM',
    isState: true,
  },
  {
    name: 'New York',
    abbrev: 'NY',
    isState: true,
  },
  {
    name: 'North Carolina',
    abbrev: 'NC',
    isState: true,
  },
  {
    name: 'North Dakota',
    abbrev: 'ND',
    isState: true,
  },
  // {
  //     name: "Northern Mariana Islands",
  //     abbrev: "MP",
  //     isTerritory: true,
  // },
  {
    name: 'Ohio',
    abbrev: 'OH',
    isState: true,
  },
  {
    name: 'Oklahoma',
    abbrev: 'OK',
    isState: true,
  },
  {
    name: 'Oregon',
    abbrev: 'OR',
    isState: true,
  },
  // {
  //     name: "Palau",
  //     abbrev: "PW",
  //     isTerritory: true,
  // },
  {
    name: 'Pennsylvania',
    abbrev: 'PA',
    isState: true,
  },
  // {
  //     name: "Puerto Rico",
  //     abbrev: "PR",
  //     isTerritory: true,
  // },
  {
    name: 'Rhode Island',
    abbrev: 'RI',
    isState: true,
  },
  {
    name: 'South Carolina',
    abbrev: 'SC',
    isState: true,
  },
  {
    name: 'South Dakota',
    abbrev: 'SD',
    isState: true,
  },
  {
    name: 'Tennessee',
    abbrev: 'TN',
    isState: true,
  },
  {
    name: 'Texas',
    abbrev: 'TX',
    isState: true,
  },
  {
    name: 'Utah',
    abbrev: 'UT',
    isState: true,
  },
  {
    name: 'Vermont',
    abbrev: 'VT',
    isState: true,
  },
  // {
  //     name: "Virgin Islands",
  //     abbrev: "VI",
  //     isTerritory: true,
  // },
  {
    name: 'Virginia',
    abbrev: 'VA',
    isState: true,
  },
  {
    name: 'Washington',
    abbrev: 'WA',
    isState: true,
  },
  {
    name: 'West Virginia',
    abbrev: 'WV',
    isState: true,
  },
  {
    name: 'Wisconsin',
    abbrev: 'WI',
    isState: true,
  },
  {
    name: 'Wyoming',
    abbrev: 'WY',
    isState: true,
  },
].map((e) => ({
  ...e,
  slug: e.name.toLowerCase().replace(/ /g, '-'),
}))

// Possibly territories can be supported later.
export const usaStates = usaEntities.filter((e) => e.isState)
export const usaStatesAndDc = usaEntities.filter(
  (e) => e.isState || e.abbrev == 'DC'
)

const _top5SwingStates = ['FL', 'PA', 'WI', 'MI', 'AZ']
const _top10SwingStates = [..._top5SwingStates, 'MN', 'NC', 'NV', 'CO', 'OH']
export const top5SwingStates = usaStates.filter((s) =>
  _top5SwingStates.includes(s.abbrev)
)
export const top10SwingStates = usaStates.filter((s) =>
  _top10SwingStates.includes(s.abbrev)
)
