const hooks: Array<() => void> = []
let hooked = false

const hook = () => {
  if (hooked) return
  hooked = true
  ;[`SIGINT`, `uncaughtException`, `SIGTERM`].forEach((signal) => {
    process.on(signal, (e) => {
      console.log('Exiting...', e)
      hooks.forEach((hook) => hook())
      process.exit(0)
    })
  })
}

export const addCleanupHook = (f: () => void) => {
  hooks.push(f)
  hook()
}
