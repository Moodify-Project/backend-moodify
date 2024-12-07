import { Storage } from "@google-cloud/storage";

export const storageConfig = () =>{
    return new Storage({
        keyFilename: process.env.BUCKET_AUTH_PATH || 'D:/DEV_REACT/backend-moodify/credential-bucket.json'
    });
};