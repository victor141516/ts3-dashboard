export type ServerSummaryResponse = Record<string, string[]>

export const getServerSummary: () => Promise<ServerSummaryResponse> = () =>
  fetch(`${import.meta.env.VITE_API_HOST}/api/ts3/summary`).then((r) => r.json())
