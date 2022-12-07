declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            MONGO_URI: string
            API_VERSION: string
        }
    }
}

export {}