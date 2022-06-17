import cors from 'cors'
import express from 'express'
import { addCleanupHook } from './services/cleanup'
import { TS3_HOST, BOT_USERNAME, BOT_PASSWORD, PORT } from './services/config'
import { TeamSpeakClient } from './services/ts3'

const tsClient = new TeamSpeakClient({ host: TS3_HOST, username: BOT_USERNAME, password: BOT_PASSWORD })

addCleanupHook(() => tsClient.quit())

const app = express()
app.use(cors())

app.get('/api/ts3/summary', async (req, res) => {
  const summary = await tsClient.getServerSummary()
  res.json(summary)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
