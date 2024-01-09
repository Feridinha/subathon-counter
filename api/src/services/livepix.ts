import { WebSocket } from "ws"
import myEnv from "../myEnv"

export type DonationData = ShowNotificationMessage["payload"]["data"]["data"]

const getFuckingToken = async (widgetId: string) => {
    const response = await fetch(
        `https://webservice.livepix.gg/pubsub/widget/${widgetId}`
    )
    const data = (await response.json()) as { token: string }
    return data.token
}

interface SubscribeMessage {
    type: 1
    event: "subscribe"
    payload: string
    time: number
}

interface ConfirmationMessage {
    type: 1
    event: "confirmation"
    payload: string
    time: number
}

interface PingMessage {
    type: 1
    event: "ping"
    payload: number
    time: number
}

interface PongMessage {
    type: 1
    event: "pong"
    payload: number
    time: number
}

interface ShowNotificationMessage {
    type: number
    topic: string
    event: "notification:show"
    payload: {
        alertId: string
        data: {
            buildNumber: number
            config: {
                maximumDuration: number
                minimumDuration: number
                textToSpeechPhrase: string
            }
            data: {
                amount: {
                    currency: string
                    formatted: string
                    value: number
                }
                author: string
                message: string
                type: string
            }
            parameters: {
                color: string
            }
            templateId: string
            type: string
            userId: string
            versionNumber: number
        }
        receipt: string
    }
    time: number
}

type AvailableEvents =
    | SubscribeMessage
    | PingMessage
    | PongMessage
    | ShowNotificationMessage
    | ConfirmationMessage

interface MessageWrapper<T extends AvailableEvents> {
    id?: string
    message: T
}

const getSubscribeMessage = (payload: string) => {
    const result = {
        message: {
            type: 1,
            event: "subscribe",
            payload,
            time: Math.round(new Date().getTime() / 1000),
        },
    }
    return result
}

const getAuthMessage = (token: string) => {
    const result = {
        message: {
            type: 1,
            event: "auth",
            payload: token,
            time: Math.round(new Date().getTime() / 1000),
        },
    }
    return result
}

type DonationCallback = (donation: DonationData) => void
let onDonation: null | DonationCallback = null

const sendMessage = (ws: WebSocket, message: Object) => {
    const json = JSON.stringify(message)
    const buffer = Buffer.from(json)
    ws.send(buffer)
}

const handleConection = (ws: WebSocket) => (event: any) => {
    const data: MessageWrapper<AvailableEvents> = JSON.parse(event.toString())
    const { message } = data

    switch (message.event) {
        case "ping":
            const pongMessage: MessageWrapper<PongMessage> = {
                message: {
                    type: 1,
                    event: "pong",
                    payload: message.payload,
                    time: Math.round(new Date().getTime() / 1000),
                },
            }
            sendMessage(ws, pongMessage)
            break

        case "notification:show":
            const donation = message.payload.data.data

            const confirmationMessage: MessageWrapper<ConfirmationMessage> = {
                message: {
                    type: 1,
                    event: "confirmation",
                    payload: data.id!,
                    time: Math.round(new Date().getTime() / 1000),
                },
            }
            sendMessage(ws, confirmationMessage)
            if (onDonation) onDonation(donation)
    }
}

const startConnection = () => {
    const ws = new WebSocket(`wss://pubsub.livepix.gg/ws`)

    ws.onopen = async () => {
        console.log("Websocket conectado")
        const widgetId = myEnv.LIVEPIX_WIDGET_ID
        const token = await getFuckingToken(widgetId)
        const authMessage = getAuthMessage(token)

        sendMessage(ws, authMessage)

        const message1 = getSubscribeMessage(`widget:${widgetId}`)
        sendMessage(ws, message1)
        console.log("Websocket logado")
    }

    ws.onclose = () => {
        console.log("websocket fechado")
        startConnection()
    }

    ws.on("message", handleConection(ws))
}

const livepix = {
    setDonationCallback: (callback: DonationCallback) => {
        onDonation = callback
    },
    startConnection
}

export default livepix
