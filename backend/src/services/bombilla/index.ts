import { login as originalLogin } from './login'
import { listDevices as originalListDevices } from './devices'
import { turnOn as originalTurnOn, turnOff as originalTurnOff } from './plug'

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

export async function listDevices() {
  if (!accessToken) throw new Error('Login first')
  return originalListDevices(accessToken)
}

export async function turnOn(device: string) {
  if (!accessToken) throw new Error('Login first')
  return originalTurnOn(accessToken, { device })
}

export async function turnOff(device: string) {
  if (!accessToken) throw new Error('Login first')
  return originalTurnOff(accessToken, { device })
}
