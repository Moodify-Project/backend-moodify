import { Storage } from '@google-cloud/storage';
import { storageConfig } from '../internal/configs/bucket';

const checkBucketExist = async (bucketName: string): Promise<boolean> => {
    const storage = storageConfig();

    try {
        const [metadata] = await storage.bucket(bucketName).getMetadata();
        return metadata !== undefined;
    } catch (error) {
        console.log('Error bucket not found:', error);
        return false;
    }
};

const uploadFileThroughStream = async (fileBuffer: Buffer, bucketName: string, fileName: string) => {
    const storage = storageConfig();

    const photoBucket = storage.bucket(bucketName);
    const file = photoBucket.file(fileName);

    file.createWriteStream({
        resumable: false,
        gzip: true,
    })
    .on('finish', async () => {
        console.log(`File ${fileName} uploaded successfully.`);
        await storage.bucket(bucketName).file(fileName).makePublic();
    })
    .on('error', (err) => {
        console.log(`Something error: ${err} can't upload the file to bucket`);
    })
    .end(fileBuffer);
};

export const uploadPhotoToBucketGCS = async (imgBuffer: Buffer, fileName: string, bucketName: string): Promise<string> => {
    const storage = storageConfig();

    const location = 'ASIA-SOUTHEAST2';

    const bucketExist = await checkBucketExist(bucketName);

    if (!bucketExist) {
        try {
            const [bucket] = await storage.createBucket(bucketName, {
                location,
                storageClass: 'STANDARD',
            });

            console.log(`${bucket.name} successfully created`);
        } catch (error: any) {
            console.log('Error creating bucket:', error);
        }
    }

    await uploadFileThroughStream(imgBuffer, bucketName, fileName);
    
    const objectUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return objectUrl;
};
