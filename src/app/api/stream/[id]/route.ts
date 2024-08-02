import { requestStore } from '@/lib/requestStore'
import type { NextRequest } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    console.log(`SSE connection established for ID: ${id}`)

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        start(controller) {
            // biome-ignore lint/suspicious/noExplicitAny: TODO: Fix any type
            const pushEvent = (data: any) => {
                console.log(`Pushing event for ID ${id}:`, data)
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                )
            }

            requestStore.subscribe(id, pushEvent)

            const existingRequests = requestStore.getRequests(id)
            existingRequests.forEach(pushEvent)

            // Keepalive
            const intervalId = setInterval(() => {
                controller.enqueue(encoder.encode(': keepalive\n\n'))
            }, 30000)

            request.signal.addEventListener('abort', () => {
                console.log(`SSE connection closed for ID: ${id}`)
                clearInterval(intervalId)
                requestStore.unsubscribe(id, pushEvent)
                controller.close()
            })
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    })
}
