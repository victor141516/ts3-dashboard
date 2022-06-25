import { TeamSpeak, TeamSpeakChannel, TeamSpeakClient as LibTeamSpeakClient } from 'ts3-nodejs-library'

export type ServerSummaryResponse = Record<string, string[]>

export class TeamSpeakClient {
  private client: Promise<TeamSpeak> | undefined
  private host: string
  private username: string
  private password: string
  private debug: boolean
  private cache: {
    me: LibTeamSpeakClient | null
    channels: TeamSpeakChannel[] | null
    clients: Record<string, LibTeamSpeakClient[]> | null
  }
  private resetCacheTimeout: null | NodeJS.Timeout
  private viewers: Set<string>
  private viewersTimeouts: Record<string, NodeJS.Timeout>

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
    this.cache = {
      me: null,
      channels: null,
      clients: null,
    }
    this.resetCacheTimeout = null
    this.viewers = new Set()
    this.viewersTimeouts = {}
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

  private resetCache() {
    this.resetCacheTimeout = setTimeout(() => {
      if (this.resetCacheTimeout) clearTimeout(this.resetCacheTimeout)
      this.cache = {
        me: null,
        channels: null,
        clients: null,
      }
    }, 2000)
  }

  addViewer(name: string) {
    this.viewers.add(name)
    if (this.viewersTimeouts[name]) clearTimeout(this.viewersTimeouts[name])
    this.viewersTimeouts[name] = setTimeout(() => this.viewers.delete(name), 5000)
  }

  async getServerSummary(): Promise<ServerSummaryResponse> {
    const client = (await this.client)!

    const me = this.cache.me ?? (await client.self())
    this.cache.me = me

    const apiChannels = this.cache.channels ?? (await client.channelList())
    this.cache.channels = apiChannels

    const promises = apiChannels.map(async (channel) => {
      const apiClients = this.cache.clients?.[channel.name] ?? (await channel.getClients())
      this.cache.clients ??= {}
      this.cache.clients![channel.name] = apiClients

      const clients = apiClients.filter(({ clid }) => clid !== me.clid).map(({ nickname }) => nickname)
      return [channel.name, clients]
    })
    const entries = await Promise.all(promises)
    const result = Object.fromEntries(entries) as Record<string, string[]>
    result._viewers = Array.from(this.viewers)
    this.resetCache()
    return result
  }

  async sendMessageToChannel(channel: string, message: string) {
    const client = (await this.client)!

    const apiChannels = this.cache.channels ?? (await client.channelList())
    this.cache.channels = apiChannels

    const channelToMessage = apiChannels.find((apiChannel) => apiChannel.name === channel)
    if (!channelToMessage) throw new Error(`channel ${channel} not found`)

    await channelToMessage.message(message)

    this.resetCache()
  }

  async quit() {
    ;(await this.client!).quit()
  }
}
