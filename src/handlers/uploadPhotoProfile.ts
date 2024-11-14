import { Request, Response } from 'express';
import { uploadPhotoToBucketGCS } from '../utils/uploadPhotoToBucket';
import { prisma } from '../configs/prisma';

interface AuthMiddlewareRequest extends Request {
    email?: string,
}

const uploadPhotoProfile = async (req: AuthMiddlewareRequest, res: Response): Promise<any> => {
    const { file, email } = req;

    if (!email) {
        return res.status(403).json({
            status: false,
            message: 'Please login before update photo profile',
        })
    }

    if (!file) {
        return res.status(400).json({
            status: false,
            message: 'Please provide image',
        })
    }

    console.log(typeof file.buffer);

    const ext = file.mimetype.split('/')[1];

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    const fileName = `profileImage_${email}_${day}${month}${year}_${hours}${minutes}${seconds}.${ext}`;

    console.log(ext);
    console.log(fileName);

    const bucketName = 'bucket-profile-moodify';
    
    const objectUrl: string = await uploadPhotoToBucketGCS(file.buffer, fileName, bucketName);

    const picUpdated = await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            urlphoto: objectUrl,
        }
    })

    if (!picUpdated) {
        return res.status(500).json({
            status: false,
            message: 'Failed upload photo due to server error',
            imageUrl: objectUrl,
        })
    }

    return res.status(200).json({
        status: true,
        message: 'success upload image',
        imageUrl: objectUrl,
    })
}

export default uploadPhotoProfile;
