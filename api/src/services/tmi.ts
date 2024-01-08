import tmiJs from "tmi.js"
import myEnv from "../myEnv"

const client = new tmiJs.Client({
    options: {
        debug: false,
    },
    // channels: ["xqc"],
    channels: myEnv.TMI_CHANNELS.split(","),
    // connection: {
    //     reconnect: true,
    //     secure: true,
    //     server: "irc.fdgt.dev",
    // },
    // identity: {
    //     username: "robert",
    //     password: "asd",
    // },
})

// const twitch = tmiJs.client({
//     channels: ["feridinha"],
// })

type BitsCallback = ({
    username,
    bitsAmount,
    color,
}: {
    username: string
    bitsAmount: number
    color: string
}) => void

type SubCallback = ({
    username,
    color,
}: {
    username: string
    color: string
}) => void

type SubGroupCallback = ({
    username,
    color,
}: {
    username: string
    color: string
}) => void

type SubGiftCallback = ({
    author,
    receiver,
    authorColor,
}: {
    author: string
    receiver: string
    authorColor: string
}) => void

let subCallback: null | SubCallback = null
let bitsCallback: null | BitsCallback = null
let subGroupCallback: null | SubGroupCallback = null
let subgiftCallback: null | SubGiftCallback = null

client.on("cheer", (channel, userstate, message) => {
    const bits = parseInt(userstate.bits!)
    if (bitsCallback)
        bitsCallback({
            bitsAmount: bits,
            username: userstate.username || "anonymous",
            color: userstate.color || "#ffffff",
        })
})

client.on(
    "subgift",
    (channel, username, streak, recipient, methods, userstate) => {
        if (subgiftCallback)
            subgiftCallback({
                author: username,
                authorColor: userstate.color || "#ffffff",
                receiver: recipient,
            })
    }
)

client.on("resub", (channel, username, months, message, userstate, methods) => {
    if (subCallback)
        subCallback({
            username,
            color: userstate.color || "#ffffff",
        })
})

client.on("subscription", (channel, username, methods, message, userstate) => {
    if (subCallback)
        subCallback({
            username,
            color: userstate.color || "#ffffff",
        })
})

client.on(
    "submysterygift",
    (channel, username, numbOfSubs, methods, userstate) => {
        if (subGroupCallback)
            subGroupCallback({
                username,
                color: userstate.color || "#ffffff",
            })
    }
)

client.on("primepaidupgrade", (channel, username, methods, userstate) => {
    console.log("Prime upgrade", username)
    if (subCallback)
        subCallback({
            username,
            // months: 1,
            color: userstate.color || "#ffffff",
        })
})

// twitch.on("message", (channel, tags, message, self) => {
//     client.say("feridinha", message)
// })

client.on("connected", () => {
    console.log("TMI Connected (fdgt)")
})

// twitch.on("connected", () => {
//     console.log("TMI Connected (twitch)")
// })

const tmi = {
    connect: () => {
        client.connect()
        // twitch.connect()
    },
    getClient: () => client,
    setSubCallback: (cb: SubCallback) => {
        subCallback = cb
    },
    setBitsCallback: (cb: BitsCallback) => {
        bitsCallback = cb
    },
    setSubGroupCallback: (cb: SubGroupCallback) => {
        subGroupCallback = cb
    },
    setSubGiftCallback: (cb: SubGiftCallback) => {
        subgiftCallback = cb
    },
}
export default tmi
