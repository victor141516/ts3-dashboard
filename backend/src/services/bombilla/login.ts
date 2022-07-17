import crypto from 'crypto'

interface LoginResponse {
  loginSession: {
    sessionId: string
    rfSessionId: string
  }
}
const md5 = (s: string) => crypto.createHash('md5').update(s).digest('hex')

export async function login({ email, password }: { email: string; password: string }) {
  const params = new URLSearchParams()
  params.append('featureCode', 'aee97491c2f59cdfafed42b4133f8908')
  params.append(
    'pushRegisterJson',
    JSON.stringify([
      {
        channel: 99,
      },
      {
        channel: 6,
        channelRegisterJson: JSON.stringify({
          token: 'a',
        }),
      },
    ]),
  )
  params.append('pushExtJson', JSON.stringify({ language: '', protoVer: '2' }))
  params.append('smsCode', '')
  params.append('msgType', '0')
  params.append('cuName', 'SU4yMDI1')
  params.append('longitude', '')
  params.append('latitude', '')
  params.append('bizType', '')
  params.append('smsToken', '')
  params.append('account', email)
  params.append('password', md5(password))
  params.append('imageCode', '')
  params.append('redirect', '0')
  params.append('zoneOffset', '1.0')
  const body = params.toString()

  return fetch('https://apiieu.ezvizlife.com/v3/users/login/v5', {
    method: 'POST',
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
      sessionId: '',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'okhttp/3.12.1',
    },
    body,
  })
    .then((r) => r.json() as Promise<LoginResponse>)
    .then((r) => ({ accessToken: r.loginSession.sessionId, refreshToken: r.loginSession.rfSessionId }))
}
