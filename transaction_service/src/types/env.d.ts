declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVER_PORT: number
            MONGODB_CONNECTION_STRING: string,
            JWT_SECRET_KEY: string,
            AZURE_BLOB_STORAGE_CONNECTION_STRING: string,
            AZURE_BLOB_STORAGE_CONTAINER_NAME: string
        }
    }
}

export {}