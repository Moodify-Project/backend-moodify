import { uploadPhotoToBucketGCS } from "../../utils/uploadPhotoToBucket";
import { UserRepository } from "../repositories/UserRepository";

export class UploadPhotoUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute = async(email: string, file: any): Promise<string>  => {
        // console.log(typeof file.buffer);

        console.log(file);

        if (file.size >= 2000000) throw new Error('Max size of image file must be below 2 MB');

        const ext = file.mimetype.split("/")[1];

        const allowedExtension = ["png", "jpeg", "jpg", "webp"];

        const extensionFileIsImage = allowedExtension.includes(ext);

        // console.log(extensionFileIsImage)

        if (!extensionFileIsImage) throw new Error('Only PNG, JPEG, JPG, and WEBP are allowed');


        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
      
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");      

        const fileName = `profileImage_${email}_${day}${month}${year}_${hours}${minutes}${seconds}.${ext}`;
    
        const bucketName = process.env.BUCKET_NAME || "bucket-profile-moodify";

        // TODO: add error handling in upload bucket utils
        const objectUrl: string = await uploadPhotoToBucketGCS(
            file.buffer,
            fileName,
            bucketName
        )

        const picUpdated = this.userRepository.updatePhotoProfileUser(email, objectUrl);

        if (!picUpdated) {
            throw new Error('UnexpectedErrorOccur');
        }

        return objectUrl;
    }
}