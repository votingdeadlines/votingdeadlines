import { spawn }  from 'child_process'

describe('votingdeadlines-web', () => {
  describe('development', () => {
    const fnTimeout = 2 * 60 * 1000
    const testTimeout = fnTimeout + 15 * 1000

    it('runs development server', async () => {
      let success = false

      try {
        success = await isDevelopmentServerWorking(fnTimeout)
      } catch (e) {
        console.error(e)
      }

      expect(success).toBe(true)
    }, testTimeout)
  })
})

// Runs the development server in a container, and returns a promise that
// resolves to `true` if it finds a success message in stdout.
function isDevelopmentServerWorking(timeoutMs: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const cmd = 'docker-compose'
    const args = ['-f', 'web-dev.compose.yaml', 'up', '--build', '--remove-orphans']
    const docker = spawn(cmd, args)

    let killAttempted = false

    setTimeout(() => {
      reject(`Timeout in isDevelopmentServerWorking after ${timeoutMs}ms`)
      !killAttempted && docker.kill()
      killAttempted = true
    }, timeoutMs)

    docker.stdout.on('data', function (data) {
      const msg = data.toString().trim()
      const successMsgs = ['> Listening on http://localhost:3000']
      const isSuccessMsg = !!successMsgs.find(m => msg.indexOf(m) >= 0)
      if (isSuccessMsg) {
        resolve(true)
        !killAttempted && docker.kill()
        killAttempted = true
      }

      !killAttempted && console.log(msg)
    })

    docker.stderr.on('data', function (data) {
      const msg = data.toString().trim()
      const knownMsgs = [
        'Building',
        'Starting',
        'Recreating',
        'is up-to-date',
        'Stopping',
        'Killing',
      ]
      const isKnownMsg = !!knownMsgs.find(m => msg.indexOf(m) >= 0)
      if (!isKnownMsg) {
        reject(msg || 'Unknown stderr in test.')
        !killAttempted && docker.kill()
        killAttempted = true
      }

      !killAttempted && console.log(msg)
    });

    docker.on('exit', function (code) {
      const codeString = code ? code.toString() : ''
      const msg = `Child process exited with code ${codeString}`
      reject(msg)
    });
  })
}
