interface PlugTurnResponse {
  meta: {
    code: number
  }
}

interface PlugStatusResponse {
  switchInfo: { enable: 1 | 0 }
  meta: { code: 200 | number }
}

async function turn(accessToken: string, { device, newState }: { device: string; newState: string }) {
  const result = await fetch(`https://apiieu.ezvizlife.com/v3/devices/${device}/0/${newState}/14/switchStatus`, {
    method: 'PUT',
    headers: {
      featureCode: 'a',
      clientType: '3',
      osVersion: '12',
      clientVersion: '5.6.5.0706',
      customno: '1000001',
      clientNo: 'google',
      appId: 'ys7',
      language: 'en_US',
      lang: 'en',
      sessionId: accessToken,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'okhttp/3.12.1',
    },
  }).then((r) => r.json() as Promise<PlugTurnResponse>)
  if (result.meta.code !== 200) throw new Error('Error turning plug')
}

export async function status(accessToken: string, { device }: { device: string }) {
  const result = await fetch(`https://apiieu.ezvizlife.com/v3/devices/${device}/switch/status?type=14`, {
    headers: {
      sessionId: accessToken,
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'okhttp/3.12.1',
    },
  }).then((r) => r.json() as Promise<PlugStatusResponse>)
  if (result.meta.code !== 200) throw new Error('Error getting plug status')
  return result.switchInfo.enable === 1
}

export const turnOn = (accessToken: string, { device }: { device: string }) =>
  turn(accessToken, { device, newState: '1' })

export const turnOff = (accessToken: string, { device }: { device: string }) =>
  turn(accessToken, { device, newState: '0' })
