import { generateResponse, updateRaffle } from './helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return await updateRaffle()
  } catch (error) {
    return generateResponse(500, { success: false, message: 'unknown error', data: null })
  }
}
