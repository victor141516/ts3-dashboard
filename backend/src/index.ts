import cors from 'cors'
import express, { Request } from 'express'
import { addCleanupHook } from './services/cleanup'
import { TS3_HOST, BOT_USERNAME, BOT_PASSWORD, PORT } from './services/config'
import { TeamSpeakClient } from './services/ts3'

const tsClient = new TeamSpeakClient({ host: TS3_HOST, username: BOT_USERNAME, password: BOT_PASSWORD })

addCleanupHook(() => tsClient.quit())

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/ts3/summary', async (req, res) => {
  const summary = await tsClient.getServerSummary()
  res.json(summary)
})

app.post('/api/ts3/message', async (req: Request<unknown, unknown, { channel: string; message: string }>, res) => {
  const { channel, message } = req.body
  await tsClient.sendMessageToChannel(channel, message)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
