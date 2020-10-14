import { Selector } from 'testcafe';

const DEV_PORT = 3000
const DEV_URL = `http://localhost:${DEV_PORT}`
const WEB_URL = DEV_URL

fixture(WEB_URL)
  .page(WEB_URL)

test('Can take screenshot', async t => {
  await t.takeScreenshot()
});
