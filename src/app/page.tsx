'use client'
import WebhookTester from '@/components/WebhookTester'

export default function Home() {
    return (
        <main className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Webhook Tester</h1>
            <WebhookTester />
        </main>
    )
}
