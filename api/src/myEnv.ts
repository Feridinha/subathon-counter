import { z } from "zod"

const envSchema = z.object({
    LIVEPIX_WIDGET_ID: z.string(),
    TMI_CHANNELS: z.string(),
})

const myEnv = envSchema.parse(process.env)

console.log("Iniciando variaveis de ambiente", myEnv)

export default myEnv
