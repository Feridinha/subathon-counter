import storage from "./storage"

const storageData = storage.get()

let timeStart = new Date().getTime()
let timeEnd = timeStart + storageData.timeLeft

function minutesToMs(minutes: number): number {
    return minutes * 60000
}

export interface IMultipliers {
    msPerSub: number
    msPerReal: number
    msPerBit: number
}

let multipliers: IMultipliers = {
    msPerReal: storageData.msPerReal,
    msPerSub: storageData.msPerSub,
    msPerBit: storageData.msPerBit,
}

const timer = {
    getMsLeft: (): number => {
        const now = new Date().getTime()
        const msLeft = timeEnd - now || 0
        return msLeft > 0 ? msLeft : 0
    },
    addMs(msToAdd: number): void {
        console.log("Adicionando para o timer:", msToAdd)
        timeStart = new Date().getTime()
        const timeLeft = this.getMsLeft()

        timeEnd = timeStart + msToAdd + timeLeft
    },
    removeMs(msToRemove: number): void {
        console.log("Removendo do timer:", msToRemove)
        timeStart = new Date().getTime()
        const timeLeft = this.getMsLeft()

        timeEnd = timeStart - msToRemove + timeLeft
    },
    getMultipliers: () => multipliers,
    setMultipliers: (newMultipliers: IMultipliers) => {
        multipliers = newMultipliers
    },
    setMs(ms: number): void {
        timeStart = new Date().getTime()
        timeEnd = timeStart + ms
    },
    minutesToMs,
    getRawTime() {
        return { timeEnd, timeStart }
    },
}

export default timer
