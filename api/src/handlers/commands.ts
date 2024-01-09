import ms from "parse-duration"
import { ChatUserstate } from "tmi.js"
import websocket from "../websocket"
import timer from "./timer"
import type { IMultipliers } from "./timer"

const PREFIX = "!"

const handleTimer = (source: string, rawArgs: string[]) => {
    if (rawArgs.length === 0) return console.log("Sem args", rawArgs)
    const firstArg = rawArgs[0]
    const operator = firstArg[0]
    const prettyTime = firstArg.slice(1, firstArg.length)

    const msTime = ms(prettyTime)
    if (typeof msTime !== "number")
        return console.log("Tempo inválido", prettyTime)

    switch (operator) {
        case "+":
            timer.addMs(msTime)
            break
        case "-":
            timer.removeMs(msTime)
            break
        case "=":
            timer.setMs(msTime)
            break
        default:
            console.log("Operator inválido", operator)
            return
    }

    websocket.broadcast("forced-time", { operator, prettyTime })
    websocket.sendTime()
}

const handleValueChange =
    (key: keyof IMultipliers) => (source: string, rawArgs: string[]) => {
        const [value] = rawArgs
        const msTime = ms(value)
        if (!msTime) return console.log("Tempo inválido", value)
        const multipliers = timer.getMultipliers()
        timer.setMultipliers({ ...multipliers, [key]: msTime })

        console.log("Setei", key, msTime, value)
    }

const handleReload = () => {
    websocket.broadcast("reload")
}

const handlePause = () => {
    timer.togglePause()
    websocket.broadcast("pause-status", timer.getPauseStatus())
    console.log("Paused", timer.getPauseStatus())
}

let whiteListUserIds = ["270082103", "144746469", "94753308"]

const handleMessage = (
    channel: string,
    tags: ChatUserstate,
    message: string,
    self: boolean
) => {
    if (tags["message-type"] !== "chat") return
    if (self || !message.startsWith(PREFIX)) return

    const [source, ...args] = message.slice(1).split(/ +/g)
    const isMod = whiteListUserIds.includes(tags["user-id"]!)
    if (!isMod) return console.log("Usuário não é mod", tags.username!, message)

    switch (source) {
        case "timer":
            return handleTimer(source, args)
        case "real":
            return handleValueChange("msPerReal")(source, args)
        case "sub":
            return handleValueChange("msPerSub")(source, args)
        case "bit":
        case "bits":
            handleValueChange("msPerBit")(source, args)
            return
        case "reload":
            return handleReload()
        case "pause":
        case "stop":
        case "start":
            return handlePause()

        default:
            return
    }
}
const commands = {
    handleMessage,
}

export default commands
