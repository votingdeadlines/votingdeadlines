import { exec, resolve, writeFile } from './binUtilities'

const webRoot = `${__dirname}/..`
const METRICS_JSON_PATH = resolve(`${webRoot}/metrics.json`)

main()

function main() {
  const newMetrics = JSON.stringify(
    {
      cssLOC: getLOC('*.css'),
      jsonLOC: getLOC('*.json'),
      jsLOC: getLOC('*.js'),
      shLOC: getLOC('*.sh'),
      TODOs: getTODOs(),
      tsLOC: getLOC('*.ts'),
      svelteLOC: getLOC('*.svelte'),
    },
    null,
    2
  ) + '\n'

  writeFile(METRICS_JSON_PATH, newMetrics)
}

// TODO: exclude build, sapper dirs
function getLOC(pattern: string): string {
  const cmd = [
    `find . -name "${pattern}" -not -path "**/node_modules/*"`,
    `| xargs wc -l | tail -n 1 | awk '{print $1}'`,
  ].join(" ")
  return exec(cmd).trim()
}

function getTODOs() {
  const cmd = `grep --exclude=**/node_modules/* -rnw '.' -e 'TODO' | wc -l`
  return exec(cmd).trim()
}
