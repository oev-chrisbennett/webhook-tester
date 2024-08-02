export type WebhookData = {
    id: string
    body: string
    headers: Record<string, string>
    timestamp: string
}

type Subscriber = (data: WebhookData) => void

class RequestStore {
    private requests: Map<string, WebhookData[]> = new Map()
    private subscribers: Map<string, Set<Subscriber>> = new Map()

    addRequest(id: string, data: WebhookData) {
        if (!this.requests.has(id)) {
            this.requests.set(id, [])
        }
        this.requests.get(id)?.push(data)

        // biome-ignore lint/complexity/noForEach: TS interference
        this.subscribers.get(id)?.forEach((subscriber) => subscriber(data))
    }

    getRequests(id: string): WebhookData[] {
        return this.requests.get(id) || []
    }

    subscribe(id: string, callback: Subscriber) {
        if (!this.subscribers.has(id)) {
            this.subscribers.set(id, new Set())
        }
        this.subscribers.get(id)?.add(callback)
    }

    unsubscribe(id: string, callback: Subscriber) {
        this.subscribers.get(id)?.delete(callback)
    }
}

export const requestStore = new RequestStore()
