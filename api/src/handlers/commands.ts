import ms from "parse-duration"
import { ChatUserstate } from "tmi.js"
import websocket from "../websocket"
import timer from "./timer"

const PREFIX = "!"

const handleTimer = (source: string, rawArgs: string[]) => {
    if (rawArgs.length === 0) return console.log("Sem args", rawArgs)
    const firstArg = rawArgs[0]
    const operator = firstArg[0]
    const prettyTime = firstArg.slice(1, firstArg.length)

    const msTime = ms(prettyTime)
    if (typeof msTime !== "number") return console.log("Tempo inválido", prettyTime)

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

const handleReal = (source: string, rawArgs: string[]) => {
    const prettyTime = rawArgs[0]
    const msTime = ms(prettyTime)
    if (!msTime) return console.log("Tempo inválido", prettyTime)
    const multipliers = timer.getMultipliers()
    timer.setMultipliers({ ...multipliers, msPerReal: msTime })

    console.log("Setei real", msTime, prettyTime)
}

const handleSub = (source: string, rawArgs: string[]) => {
    const prettyTime = rawArgs[0]
    const msTime = ms(prettyTime)
    if (!msTime) return console.log("Tempo inválido", prettyTime)
    const multipliers = timer.getMultipliers()
    timer.setMultipliers({ ...multipliers, msPerSub: msTime })

    console.log("Setei sub", msTime, prettyTime)
}

const handleBit = (source: string, rawArgs: string[]) => {
    const prettyTime = rawArgs[0]
    const msTime = ms(prettyTime)
    if (!msTime) return console.log("Tempo inválido", prettyTime)
    const multipliers = timer.getMultipliers()
    timer.setMultipliers({ ...multipliers, msPerBit: msTime })

    console.log("Setei bit", msTime, prettyTime)
}

const handleReload = () => {
    websocket.broadcast("reload")
}

const handleMessage = (
    channel: string,
    tags: ChatUserstate,
    message: string,
    self: boolean
) => {
    if (tags["message-type"] !== "chat") return
    if (self || !message.startsWith(PREFIX)) return

    const [source, ...args] = message.slice(1).split(/ +/g)
    const isMod = tags.badges?.broadcaster === "1" || tags.mod
    if (!isMod) return console.log("Usuário não é mod", tags.username!, message)

    switch (source) {
        case "timer":
            return handleTimer(source, args)
        case "real":
            return handleReal(source, args)
        case "sub":
            return handleSub(source, args)
        case "bit":
        case "bits":
            handleBit(source, args)
            return
        case "reload":
            return handleReload()
        default:
            return
    }
}
const commands = {
    handleMessage,
}

export default commands
