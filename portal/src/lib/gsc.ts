import { google } from 'googleapis'
import { readFileSync } from 'fs'

export async function getGSCClient() {
  let credentials: object
  if (process.env.GSC_CREDENTIALS_JSON) {
    credentials = JSON.parse(process.env.GSC_CREDENTIALS_JSON)
  } else if (process.env.GSC_CREDENTIALS_PATH) {
    credentials = JSON.parse(readFileSync(process.env.GSC_CREDENTIALS_PATH, 'utf-8'))
  } else {
    throw new Error('GSC credentials not configured. Set GSC_CREDENTIALS_JSON in Railway environment variables.')
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  })
  return google.searchconsole({ version: 'v1', auth })
}

export async function getSitewideAnalytics(siteUrl: string, startDate: string, endDate: string) {
  const client = await getGSCClient()
  const response = await client.searchanalytics.query({
    siteUrl,
    requestBody: { startDate, endDate, dimensions: ['page', 'query', 'date'], rowLimit: 25000 },
  })
  return response.data.rows ?? []
}

export async function getAnalyticsByDimension(
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
  rowLimit = 2500
) {
  const client = await getGSCClient()
  const response = await client.searchanalytics.query({
    siteUrl,
    requestBody: { startDate, endDate, dimensions, rowLimit },
  })
  return response.data.rows ?? []
}

export async function inspectUrl(siteUrl: string, inspectionUrl: string) {
  const client = await getGSCClient()
  const response = await client.urlInspection.index.inspect({
    requestBody: { inspectionUrl, siteUrl },
  })
  return response.data
}

export function calculateDelta(current: number, previous: number) {
  if (previous === 0) return { value: 0, percent: null, direction: 'flat' as const }
  const diff = current - previous
  const percent = (diff / previous) * 100
  return {
    value: diff,
    percent,
    direction: diff > 0 ? 'up' as const : diff < 0 ? 'down' as const : 'flat' as const,
  }
}
