export type ServerSummaryResponse = Record<string, string[]>

export const getServerSummary = (viewerName?: string) =>
  fetch(`${import.meta.env.VITE_API_HOST}/api/ts3/summary`, {
    headers: viewerName ? { 'x-ts3-viewer-name': viewerName } : {},
  }).then((r) => r.json() as Promise<ServerSummaryResponse>)

export const sendMessage: (params: { channel: string; message: string }) => Promise<{ ok: boolean }> = ({
  channel,
  message,
}) =>
  fetch(`${import.meta.env.VITE_API_HOST}/api/ts3/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel, message }),
  }).then((r) => r.json())

export const turnBombilla: ({state}: {state: 'on' | 'off'}) => Promise<{ ok: boolean }> = ({state}) => fetch(`${import.meta.env.VITE_API_HOST}/api/bombilla/turn`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ state }),
}).then((r) => r.json())

export const statusBombilla: () => Promise<{ isOn: boolean }> = () => fetch(`${import.meta.env.VITE_API_HOST}/api/bombilla`).then((r) => r.json())