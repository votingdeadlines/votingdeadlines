import { exec, resolve, writeFile } from './binUtilities'
import {
  METRICS_JSON_PATH,
  WEB_JS_BUNDLE_PATH,
  WEB_CSS_BUNDLE_PATH,
} from '../config.json'

main()

function main() {
  const root = `${__dirname}/..`
  const webJsBundlePath = resolve(`${root}/${WEB_JS_BUNDLE_PATH}`)
  const webCssBundlePath = resolve(`${root}/${WEB_CSS_BUNDLE_PATH}`)

  const newMetrics = JSON.stringify(
    {
      webCssBundleKb: getKilobytes(webCssBundlePath),
      webJsBundleKb: getKilobytes(webJsBundlePath),
    },
    null,
    2
  )

  writeFile(METRICS_JSON_PATH, newMetrics)
}

function getKilobytes(path) {
  return exec(`du -k ${path} | awk '{print $1;}'`).trim()
}
