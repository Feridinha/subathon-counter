import fs from "fs/promises"
import type { IMultipliers } from "./timer"
import type { BroadcastArgs } from "../websocket"

const FILENAME = "storage.json"

interface StorageData extends IMultipliers {
    timeLeft: number
}

let storageData: StorageData = {
    msPerBit: 1 * 60000,
    msPerReal: 1 * 60000, // 60000 = 1 minute
    msPerSub: 5 * 60000,
    timeLeft: 0,
}

const read = async () => {
    try {
        const data = await fs.readFile(FILENAME, "utf-8")
        storageData = JSON.parse(data)
        return storageData
    } catch (error: any) {
        console.error(error)
        if (error.code === "ENOENT") {
            await fs.writeFile(FILENAME, JSON.stringify(storageData, null, 4))
            return storageData
        } else {
            await fs.writeFile(FILENAME, JSON.stringify(storageData, null, 4))
            return storageData
        }
    }
}

await read()

const write = async (data: StorageData) => {
    await read() // updates and creates file
    storageData = { ...storageData, ...data }
    await fs.writeFile(FILENAME, JSON.stringify(storageData, null, 4))
    return storageData
}

const storage = { read, write, get: () => storageData }

export default storage
