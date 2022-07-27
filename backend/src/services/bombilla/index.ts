import { login as originalLogin, refresh as originalRefresh } from './login'
import { listDevices as originalListDevices } from './devices'
import { turnOn as originalTurnOn, turnOff as originalTurnOff, status as originalStatus } from './plug'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never

let accessToken: string | null = null
let refreshToken: string | null = null

export async function login(...params: Parameters<typeof originalLogin>) {
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken }
  }
  const response = await originalLogin(...params)
  if (!response.accessToken) throw new Error('Login failed')
  accessToken = response.accessToken
  refreshToken = response.refreshToken
}

export async function refresh() {
  const response = await originalRefresh({ accessToken: accessToken!, refreshToken: refreshToken! })
  if (!response.accessToken) throw new Error('Login failed')
  accessToken = response.accessToken
  refreshToken = response.refreshToken
}

const wrapWithRefresh =
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends (...args: any[]) => any>(f: T) =>
    async (...params: OmitFirst<Parameters<T>>): Promise<Awaited<ReturnType<T>>> => {
      if (!accessToken) throw new Error('Login first')
      try {
        return f(accessToken, ...params)
      } catch {
        await refresh()
        return f(accessToken, ...params)
      }
    }

export const listDevices = wrapWithRefresh(originalListDevices)
export const turnOn = wrapWithRefresh(originalTurnOn)
export const turnOff = wrapWithRefresh(originalTurnOff)
export const status = wrapWithRefresh(originalStatus)
