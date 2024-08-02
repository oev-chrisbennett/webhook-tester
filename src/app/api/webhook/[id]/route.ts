import { requestStore } from '@/lib/requestStore'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const body = await request.json()
    const headers = Object.fromEntries(request.headers)

    const webhookData = {
        id,
        body,
        headers,
        timestamp: new Date().toISOString(),
    }

    requestStore.addRequest(id, webhookData)

    return NextResponse.json({ message: 'Webhook received successfully' })
}
