'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const WebhookTester: React.FC = () => {
    const [webhookId, setWebhookId] = useState('')
    const [webhookUrl, setWebhookUrl] = useState('')
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Fix any type
    const [requests, setRequests] = useState<any[]>([])

    const generateWebhookUrl = () => {
        const newId = uuidv4()
        setWebhookId(newId)
        const newWebhookUrl = `${window.location.origin}/api/webhook/${newId}`
        setWebhookUrl(newWebhookUrl)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(webhookUrl)
    }

    useEffect(() => {
        if (!webhookId) return

        const eventSource = new EventSource(`/api/stream/${webhookId}`)

        eventSource.onmessage = (event) => {
            const newRequest = JSON.parse(event.data)
            setRequests((prevRequests) => [...prevRequests, newRequest])
        }

        return () => {
            eventSource.close()
        }
    }, [webhookId])

    return (
        <div>
            <button
                type="button"
                onClick={generateWebhookUrl}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Generate Webhook URL
            </button>
            {webhookUrl && (
                <div className="mt-4">
                    <input
                        type="text"
                        value={webhookUrl}
                        readOnly
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="button"
                        className="mt-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                        Copy to Clipboard
                    </button>
                </div>
            )}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Received Requests</h2>
                {requests.length === 0 ? (
                    <p>No requests received yet.</p>
                ) : (
                    <ul>
                        {requests.map((request) => (
                            <li
                                key={uuidv4()}
                                className="mb-4 p-4 border rounded">
                                <pre>{JSON.stringify(request, null, 2)}</pre>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default WebhookTester
