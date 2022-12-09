declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVER_PORT: number
            MONGODB_CONNECTION_STRING: string
        }
    }
}

export {}