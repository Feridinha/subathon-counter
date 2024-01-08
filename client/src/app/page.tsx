"use client"
import useSocket from "@/app/hooks/useSocket"
// import useCountdown from "@bradgarropy/use-countdown"
import { motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import useMeasure from "react-use-measure"
import styled from "styled-components"
import {
    ApiCheer,
    ApiDonation,
    ApiForcedTime,
    ApiSub,
    ApiSubGift,
} from "@/responses"

import useCountDown from "react-countdown-hook"

const PageContainer = styled.div`
    position: relative;
    display: flex;
    align-items: flex-end;
    height: 100%;
    padding: 0 0.5rem;
    font-size: 2rem;
    /* background-color: #ffffff30; */
    overflow: hidden;

    span.name {
        text-shadow: #ffffff3d 1px 0 5px;
    }
`

const EventBox = styled(motion.div)`
    position: absolute;
    font-size: 1rem;
    /* background-color: red; */
    opacity: 0;
`

interface Event {
    id: string
    text: string | JSX.Element
    isExpired: boolean
}

const interval = 1000

const getMinutes = (d: number) => 60 * 1000 * d

export default function Home() {
    let [timeLeft, { start, pause, resume, reset }] = useCountDown(0, interval)

    const [ref, size] = useMeasure()
    const socket = useSocket()
    const [events, setEvents] = useState<Event[]>([])
    const timeRef = useRef(timeLeft)

    // const addMinutesToTimer = (minutes: number) => {
    //     const ms = getMinutes(minutes)
    //     start(timeRef.current + ms)
    // }

    const addEvent = (newEvent: Event) => {
        setEvents((oldEvents) => [...oldEvents, newEvent])
        setTimeout(() => {
            setEvents((oldEvents) =>
                oldEvents.filter((e) => e.id !== newEvent.id)
            )
        }, 10000)
    }

    const handleDonation = (data: ApiDonation) => {
        const id = crypto.randomUUID()
        // addMinutesToTimer(10)
        addEvent({
            id,
            isExpired: false,
            text: `+${data.amount.formatted} de ${data.author}`,
        })
    }

    const fakeDonation = async () => {
        for (let i = 0; i < 100; i++) {
            const data: any = {
                amount: { formatted: "R$ 10,00" },
                author: crypto.randomUUID().split("-")[0],
                message: "cu",
                type: "robert",
            }
            await new Promise((r) => setTimeout(r, 300))
            handleDonation(data)
        }
    }

    const handleSub = (sub: ApiSub) => {
        const id = crypto.randomUUID()
        // addMinutesToTimer(10)
        addEvent({
            id,
            isExpired: false,
            text: (
                <>
                    <span className="name" style={{ color: sub.user.color }}>
                        {sub.user.name}
                    </span>{" "}
                    deu sub!
                </>
            ),
        })
    }

    const handleSubGift = (sub: ApiSubGift) => {
        const id = crypto.randomUUID()
        // addMinutesToTimer(10)
        addEvent({
            id,
            isExpired: false,
            text: (
                <>
                    <span className="name" style={{ color: sub.authorColor }}>
                        {sub.author}
                    </span>{" "}
                    deu sub para {sub.receiver}!
                </>
            ),
        })
    }

    const handleCheer = (cheer: ApiCheer) => {
        const id = crypto.randomUUID()
        addEvent({
            id,
            isExpired: false,
            text: (
                <>
                    <span className="name" style={{ color: cheer.user.color }}>
                        {cheer.user.name}
                    </span>{" "}
                    deu {cheer.amount} bits!
                </>
            ),
        })
    }

    const handleForcedTime = (timeData: ApiForcedTime) => {
        const id = crypto.randomUUID()
        addEvent({
            id,
            isExpired: false,
            text: (
                <>
                    Tempo modificado pelo chat:
                    <strong>
                        {" "}
                        {timeData.operator || ""}
                        {timeData.prettyTime}
                    </strong>
                </>
            ),
        })
    }

    const handleTime = (time: number) => {
        start(time)
    }

    const handleReload = () => {
        window.location.reload()
    }

    useEffect(() => {
        if (!socket) return
        socket.on("donation", handleDonation)
        socket.on("sub", handleSub)
        socket.on("subgift", handleSubGift)
        socket.on("cheer", handleCheer)
        socket.on("time", handleTime)
        socket.on("forced-time", handleForcedTime)
        socket.on("reload", handleReload)
        socket.emit("get-time")
        return () => {
            socket.off("donation", handleDonation)
            socket.off("sub", handleSub)
            socket.off("subgift", handleSubGift)
            socket.off("cheer", handleCheer)
            socket.off("time", handleTime)
            socket.off("forced-time", handleForcedTime)
            socket.off("reload", handleReload)
        }
    }, [socket])

    useEffect(() => {
        timeRef.current = timeLeft
    }, [timeLeft])

    function msToTime(duration: number) {
        let seconds = Math.floor((duration / 1000) % 60)
        let minutes = Math.floor((duration / (1000 * 60)) % 60)
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
        let days = Math.floor(duration / (1000 * 60 * 60 * 24))

        const hoursFormatted = (days * 24 + hours).toString().padStart(2, "0")
        const minutesFormatted = minutes.toString().padStart(2, "0")
        const secondsFormatted = seconds.toString().padStart(2, "0")

        return hoursFormatted + ":" + minutesFormatted + ":" + secondsFormatted
    }

    return (
        <PageContainer>
            <h1 ref={ref}>
                {!socket && "Carregando..."}
                {socket && msToTime(timeLeft)}
            </h1>
            {events.map((event) => (
                <EventBox
                    key={event.id}
                    style={{ translate: "0% 100%", bottom: 0 }}
                    initial={{ x: size.width + 15 }}
                    animate={{
                        // x: 105,
                        y: [30, -size.height],
                        opacity: [1, 0],
                    }}
                    transition={{
                        ease: "easeInOut",
                        duration: 3,
                        opacity: {
                            delay: 2.5,
                        },
                    }}
                >
                    {event.text}
                </EventBox>
            ))}
        </PageContainer>
    )
}
