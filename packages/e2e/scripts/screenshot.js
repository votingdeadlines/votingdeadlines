import { Selector } from 'testcafe';

const DEV_URL = 'http://localhost:5000'
const WEB_URL = DEV_URL

fixture(WEB_URL)
  .page(WEB_URL)

test('Can take screenshot', async t => {
  await t.takeScreenshot()
});
