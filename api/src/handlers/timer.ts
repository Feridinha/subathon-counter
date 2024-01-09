import storage from "./storage"

const storageData = { ...storage.get() }

let timeStart = new Date().getTime()
let timeEnd = timeStart + storageData.timeLeft
let isPaused = storageData.isPaused
let lastTimePaused = storageData?.lastTimePaused || 0

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
        if (isPaused) {
            // Return the remaining time at the moment the timer was paused
            const left = timeEnd - lastTimePaused
            return left > 0 ? left : 0
        }

        const now = new Date().getTime()
        const msLeft = timeEnd - now || 0
        return msLeft > 0 ? msLeft : 0
    },
    addMs(msToAdd: number): void {
        console.log("Adicionando para o timer:", msToAdd)
        const now = isPaused ? lastTimePaused : new Date().getTime()
        const timeLeft = this.getMsLeft()

        timeEnd = now + msToAdd + timeLeft
    },
    removeMs(msToRemove: number): void {
        console.log("Removendo do timer:", msToRemove)
        const now = isPaused ? lastTimePaused : new Date().getTime()
        const timeLeft = this.getMsLeft()

        timeEnd = now - msToRemove + timeLeft
    },
    getMultipliers: () => multipliers,
    setMultipliers: (newMultipliers: IMultipliers) => {
        multipliers = newMultipliers
    },
    setMs(ms: number): void {
        if (isPaused) {
            timeEnd = lastTimePaused + ms
        } else {
            timeStart = new Date().getTime()
            timeEnd = timeStart + ms
        }
    },
    minutesToMs,
    togglePause() {
        if (isPaused) {
            const now = new Date().getTime()
            const timeLeftWhenPaused = timeEnd - lastTimePaused
            timeEnd = now + timeLeftWhenPaused
        } else {
            lastTimePaused = new Date().getTime()
        }

        isPaused = !isPaused

        // Save the current state to the storage
        storage.write({
            ...storage.get(),
            isPaused,
            timeLeft: this.getMsLeft(),
            lastTimePaused,
        })
    },

    getPauseStatus() {
        return isPaused
    },
    getLastPauseTime() {
        return lastTimePaused
    },
}

export default timer
