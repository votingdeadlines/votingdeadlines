import { exec, resolve, writeFile } from './binUtilities'

const webRoot = `${__dirname}/..`
const METRICS_JSON_PATH = resolve(`${webRoot}/metrics.json`)

const excludes = ["**/dist/**", "**/node_modules/**", "**/__sapper__/**"]

main()

function main() {
  const newMetrics = JSON.stringify(
    {
      cssLOC: getLOC('*.css', excludes),
      jsonLOC: getLOC('*.json', excludes),
      jsLOC: getLOC('*.js', excludes),
      shLOC: getLOC('*.sh', excludes),
      TODOs: getTODOs(),
      tsLOC: getLOC('*.ts', excludes),
      svelteLOC: getLOC('*.svelte', excludes),
    },
    null,
    2
  ) + '\n'

  writeFile(METRICS_JSON_PATH, newMetrics)
}

function getLOC(pattern: string, excludeDirs: Array<string>): string {
  const excludesString = excludeDirs.map(dir => `-not -path "${dir}"`).join(" ")
  const cmd = [
    `find . -name "${pattern}" ${excludesString}`,
    `| xargs wc -l | tail -n 1 | awk '{print $1}'`,
  ].join(" ")
  return exec(cmd).trim()
}

function getTODOs() {
  const cmd = `grep --exclude=**/node_modules/* -rnw '.' -e 'TODO' | wc -l`
  return exec(cmd).trim()
}
