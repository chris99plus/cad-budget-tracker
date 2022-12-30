declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVER_PORT: number
            MONGODB_CONNECTION_STRING: string
            EXECUTION_MODE: string
            JWT_SECRET_KEY: string
        }
    }
}

export {}