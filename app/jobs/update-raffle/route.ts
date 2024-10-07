import { alchemy } from '@/lib/alchemy'

export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({ data: 'get from router handler' })
}
