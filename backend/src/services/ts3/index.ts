import { TeamSpeak } from 'ts3-nodejs-library'

export type ServerSummaryResponse = Record<string, string[]>

export class TeamSpeakClient {
  private client: Promise<TeamSpeak> | undefined
  private host: string
  private username: string
  private password: string
  private cachedResponse: ServerSummaryResponse | null
  private debug: boolean

  constructor({
    host,
    username,
    password,
    debug,
  }: {
    host: string
    username: string
    password: string
    debug?: boolean
  }) {
    this.host = host
    this.username = username
    this.password = password
    this.debug = debug ?? false
    this.init()
    this.cachedResponse = null
  }

  private async init() {
    this.client = TeamSpeak.connect({
      host: this.host,
      username: this.username,
      password: this.password,
      nickname: this.username,
      autoConnect: true,
      keepAlive: true,
    })
    const client = await this.client
    if (this.debug) client.on('debug', console.log)
    client.on('error', (e) => {
      console.error('ts3 error:', e)
    })
    client.on('close', () => client.reconnect(-1, 1000))
    client.useBySid('1')
  }

  async getServerSummary(): Promise<ServerSummaryResponse> {
    if (this.cachedResponse) return this.cachedResponse

    const client = (await this.client)!
    const me = await client.self()
    const apiChannels = await client.channelList()
    const promises = apiChannels.map(async (channel) => {
      const apiClients = await channel.getClients()
      const clients = apiClients.filter(({ clid }) => clid !== me.clid).map(({ nickname }) => nickname)
      return [channel.name, clients]
    })
    const entries = await Promise.all(promises)
    const result = Object.fromEntries(entries)
    this.cachedResponse = result
    setTimeout(() => (this.cachedResponse = null), 2000)
    return result
  }

  async quit() {
    ;(await this.client!).quit()
  }
}
