import { Server } from "socket.io"
import http from "http"
import { ApiCheer, ApiDonation, ApiForcedTime, ApiSub, ApiSubGift } from "./types/responses"
import PQueue from "p-queue"
import timer from "./handlers/timer"

let io: Server
let openConnectionsCount = 0
let totalConnectionsCount = 0

const registerEvents = () => {
    io.on("connection", (socket) => {
        totalConnectionsCount += 1
        openConnectionsCount += 1

        console.log(`Conexão ${openConnectionsCount}/${totalConnectionsCount}`, socket.id)

        socket.on("ping", () => {
            socket.emit("pong")
        })

        socket.on("get-time", () => {
            socket.emit("time", timer.getMsLeft())
        })

        socket.on("get-pause-status", () => {
            socket.emit("pause-status", timer.getPauseStatus())
        })
    })
    io.on("disconnect", (socket) => {
        openConnectionsCount -= 1
    })

}

export type BroadcastArgs =
    | ["donation", ApiDonation]
    | ["sub", ApiSub]
    | ["cheer", ApiCheer]
    | ["subgift", ApiSubGift]
    | ["forced-time", ApiForcedTime]
    | ["reload"]
    | ["pause-status", boolean]

const queue = new PQueue({
    concurrency: 1,
    interval: 300,
    intervalCap: 1,
})

const websocket = {
    init: (httpServer: http.Server) => {
        io = new Server(httpServer, { cors: { origin: "*" } })
        registerEvents()
    },
    broadcast: (...args: BroadcastArgs) => {
        queue.add(() => io.emit(args[0], args[1]))
    },
    sendTime: () => {
        io.emit("time", timer.getMsLeft())
    },
}

export default websocket
