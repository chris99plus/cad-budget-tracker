import { BlockBlobClient } from "@azure/storage-blob";

export class AzureBlobStorageFileSystem {

    private connectionString: string;
    private containerName: string;


    constructor(connectionString: string, containerName: string) {
        this.connectionString = connectionString;
        this.containerName = containerName;
    }

    /**
     * Store the file which was previously uploaded into a temporary directory
     */
    public async storeUploadedFile(
        uploadedFilepath: string,
        blobName: string
    ): Promise<void> {
        let blobService = new BlockBlobClient(
            this.connectionString,
            this.containerName,
            blobName
        );
        await blobService.uploadFile(uploadedFilepath);
    }

    public async getBlobUrl(blobName: string) {
        let blobService = new BlockBlobClient(
            this.connectionString,
            this.containerName,
            blobName
        );
        return await blobService.getBlockBlobClient().url;
    }

}