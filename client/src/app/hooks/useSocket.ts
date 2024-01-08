"use client"
import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io"
import io from "socket.io-client"

const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const connectedRef = useRef(false)
    const hasBeenConectedOnce = useRef(false)

    useEffect(() => {
        if (socket) return
        const s = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
            autoConnect: true,
            transports: ["websocket"],
        })

        s.on("pong", () => {
            setTimeout(() => {
                s.emit("ping")
            }, 10000)
        })

        s.on("connect", () => {
            hasBeenConectedOnce.current = true
            connectedRef.current = true
            setSocket(s as any)
            s.emit("ping")
        })

        s.on("disconnect", () => {
            console.log("Desconectado")
            connectedRef.current = false
        })

        console.log("Mandei essa merda")

        return () => {
            // setSocket(null)
            // s.disconnect()
            // s.removeAllListeners()
        }
    }, [socket])

    useEffect(() => {
        if(!socket) return
        console.log("Executou", connectedRef, hasBeenConectedOnce)
        if(!connectedRef.current && hasBeenConectedOnce.current) {
            setSocket(null)
            console.log("véi")
        }
    }, [connectedRef.current, socket])

    return socket
}

export default useSocket
// ROBERT IS HERE ROBERT IS HERE RROBERTH IS SRHERHE IHES LOOKING TAAT ME PLESAE SEND HELP I CANT LVIE ANYWMORE HE KEEPS WATCHING ME I CANT SLEEP I CANT EAT I CANT DO ANYTHING ANYMORE PLEASE HELP ME PLEASE HELP ME PLEASE HELP'
