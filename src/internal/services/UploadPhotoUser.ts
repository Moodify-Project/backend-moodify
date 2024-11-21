import { uploadPhotoToBucketGCS } from "../../utils/uploadPhotoToBucket";
import { UserRepository } from "../repositories/UserRepository";

export class UploadPhotoUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute = async(email: string, file: any): Promise<string> => {
        console.log(typeof file.buffer);

        const ext = file.mimetype.split("/")[1];

        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
      
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");      

        const fileName = `profileImage${email}_${day}${month}${year}_${hours}${minutes}${seconds}.${ext}`;
    
        const bucketName = process.env.BUCKET_NAME || "bucket-profile-moodify";

        // TODO: add error handling in upload bucket utils
        const objectUrl: string = await uploadPhotoToBucketGCS(
            file.buffer,
            fileName,
            bucketName
        );

        const picUpdated = this.userRepository.updatePhotoProfileUser(email, objectUrl);

        if (!picUpdated) {
            throw new Error('UnexpectedErrorOccur');
        }

        return objectUrl;
    }
}