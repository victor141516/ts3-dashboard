export async function listDevices(accessToken: string) {
  return fetch('https://apiieu.ezvizlife.com/v3/userdevices/v1/resources/pagelist?groupId=-1&limit=30&offset=0', {
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
  })
    .then((r) => r.json() as Promise<DeviceListResponse>)
    .then((r) => r.resourceInfos.map(({ deviceSerial, resourceName }) => ({ deviceSerial, resourceName })))
}

interface DeviceListResponse {
  resourceInfos: [
    {
      resourceName: string
      deviceSerial: string
    },
  ]
}
