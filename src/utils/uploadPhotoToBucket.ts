// import { BucketMetadata, Storage } from '@google-cloud/storage';
// import stream from 'stream';

// export const checkBucketExist = async (bucketName: string): Promise<boolean> => {
//     const storage = new Storage({
//         keyFilename: 'D:/DEV_REACT/backend-moodify/bucketCredentialKey.json'
//     });
//     // const bucketName = 'bucket-profile';

//     try {
//         const [metadata] = await storage.bucket(bucketName).getMetadata();
//         if (metadata) {
//             return true;
//         }
//     } catch(error) {
//         console.log(error);
//         return false;
//     }

//     return false;

//     // return metadata;
// }

// // datatype file buffer?

// const uploadFileThroughStream = async (fileBuffer: Buffer, bucketName: string, fileName: string) => {
//     const storage = new Storage();

//     const photoBucket = storage.bucket(bucketName);

//     const file = photoBucket.file(fileName);

//     file.createWriteStream({
//         resumable: false,
//         gzip: true,
//     })
//     .on('finish', () => {})
//     .on('error', (err) => {})
//     .end(fileBuffer);


// }

// export const uploadPhotoToBucketGCS = async (imgBuffer: Buffer, fileName: string) => {
//     const storage = new Storage();

//     const bucketName = 'bucket-profile';
//     const storageClass = 'standard';
//     const location = 'ASIA';

//     // create bucket if no bucket when new image uploaded
//     const bucketExist = await checkBucketExist(bucketName);
//     // check bucket exist

//     if (bucketExist) {
//         try {
//             const [bucket] = await storage.createBucket(bucketName, {
//                 location,
//                 [storageClass]: true,
//             });
    
//             console.log(`${bucket.name} successfully created`);
//         } catch(error) {
//             console.log(error);
//         }
//     }

//     else {
//         await uploadFileThroughStream(imgBuffer, bucketName, fileName)
//     }


// }


import { Storage } from '@google-cloud/storage';
import stream from 'stream';

const checkBucketExist = async (bucketName: string): Promise<boolean> => {
    const storage = new Storage({
        keyFilename: 'D:/DEV_REACT/backend-moodify/bucketCredentialKey.json'
    });

    try {
        const [metadata] = await storage.bucket(bucketName).getMetadata();
        return metadata !== undefined;
    } catch (error) {
        console.log('Error bucket not found:', error);
        return false;
    }
};

const uploadFileThroughStream = async (fileBuffer: Buffer, bucketName: string, fileName: string) => {
    const storage = new Storage({
        keyFilename: process.env.BUCKET_AUTH_PATH || 'D:/DEV_REACT/backend-moodify/bucketCredentialKey.json'
    });

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
    const storage = new Storage({
        keyFilename: process.env.BUCKET_CREDENTIAL_PATH || 'D:/DEV_REACT/backend-moodify/bucketCredentialKey.json'
    });

    const location = 'ASIA-SOUTHEAST2';

    const bucketExist = await checkBucketExist(bucketName);

    if (!bucketExist) {
        try {
            const [bucket] = await storage.createBucket(bucketName, {
                location,
                storageClass: 'STANDARD',
            });
            // await storage.bucket(bucketName).makePublic();
            console.log(`${bucket.name} successfully created`);
        } catch (error: any) {
            console.log('Error creating bucket:', error);
            throw new Error(error.message)
            // return;
        }
    }

    await uploadFileThroughStream(imgBuffer, bucketName, fileName);
    
    const objectUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return objectUrl;
};
