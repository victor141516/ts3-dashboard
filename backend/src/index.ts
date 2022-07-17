import cors from 'cors'
import express, { Request } from 'express'
import { addCleanupHook } from './services/cleanup'
import { TS3_HOST, BOT_USERNAME, BOT_PASSWORD, PORT, EZVIZ_EMAIL, EZVIZ_PASSWORD } from './services/config'
import { TeamSpeakClient } from './services/ts3'
import * as bombilla from './services/bombilla'

const tsClient = new TeamSpeakClient({ host: TS3_HOST, username: BOT_USERNAME, password: BOT_PASSWORD })
const bombillaDevice = bombilla
  .login({ email: EZVIZ_EMAIL, password: EZVIZ_PASSWORD })
  .then(() => bombilla.listDevices())
  .then((devices) => devices[0].deviceSerial)

addCleanupHook(() => tsClient.quit())

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/ts3/summary', async (req, res) => {
  const summary = await tsClient.getServerSummary()
  if (req.headers['x-ts3-viewer-name']) tsClient.addViewer(req.headers['x-ts3-viewer-name'] as string)
  res.json(summary)
})

app.post('/api/ts3/message', async (req: Request<unknown, unknown, { channel: string; message: string }>, res) => {
  const { channel, message } = req.body
  await tsClient.sendMessageToChannel(channel, message)
  res.json({ ok: true })
})

app.post('/api/bombilla/turn', async (req: Request<unknown, unknown, { state: 'on' | 'off' }>, res) => {
  const { state } = req.body
  try {
    if (state === 'on') await bombilla.turnOn(await bombillaDevice)
    if (state === 'off') await bombilla.turnOff(await bombillaDevice)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false, error: (e as Error).toString() })
  }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
