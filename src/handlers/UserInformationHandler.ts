import { Response } from "express";
import { UploadPhotoUser } from "../internal/services/UploadPhotoUser";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { UpdateProfileUser } from "../internal/services/UpdateProfileUser";
import { SpecificInfoUser } from "../internal/services/SpecificInfoUser";


export class UserInformationHandler {
  private uploadPhotoUser: UploadPhotoUser; 
  private updateProfileUser: UpdateProfileUser;
  private specificInfoUser: SpecificInfoUser;

  constructor(uploadPhotoUser: UploadPhotoUser, updateProfileUser: UpdateProfileUser, specificInfoUser: SpecificInfoUser) {
    this.uploadPhotoUser = uploadPhotoUser;
    this.updateProfileUser = updateProfileUser;
    this.specificInfoUser = specificInfoUser;
  }

  uploadPhotoProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { file, email } = req;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Please input your email",
      });
    }

    if (!file) {
      return res.status(400).json({
        status: false,
        message: "Please provide your photo profile",
      });
    }

    try {
      const imageUrl = await this.uploadPhotoUser.execute(email, file);

      return res.status(200).json({
        status: true,
        message: "success upload image",
        imageUrl: imageUrl,
      });

    } catch(error: any) {

      return res.status(500).json({
        status: false,
        message: `internal server error, ${error.message}`,
      });
    }
  }

  updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { email, body } = req;
    if (!email) {
      return res.status(401).json({
        status: false,
        message: "Can't update profile due to unathorized user",
      });
    }

    if (!body) {
      return res.status(400).json({
        status: false,
        message: "Can't update profile due to lack of request body",
      });
    }

    const { name, gender, country } = body;

    const profileUpdated = await this.updateProfileUser.execute(email, name, gender, country);

    if (!profileUpdated) {
      return res.status(400).json({
        status: false,
        message: "Can't update profile due to lack of request body",
      });
    }

    return res.status(200).json({
      status: profileUpdated,
      message: "Success update your profile",
    });
  }

  getDetail = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { email } = req;

    if (!email) {
      return res.status(401).json({
        status: false,
        message: 'User not authorized',
      });

    }

    try {
      const userInfo = await this.specificInfoUser.findOrError(email);

      const userData = {
        email: userInfo.email,
        username: userInfo.username,
        name: userInfo.name,
        gender: userInfo.gender,
        country: userInfo.country,
        urlphoto: userInfo.urlphoto,
      }
  
      return res.status(200).json({
        status: true,
        result: userData,
      });

    } catch(error: any) {

      console.log("Err: ", error);
      return res.status(200).json({
        status: true,
        error: error.message,
        message: 'Error from prisma',
      });

    }
  }
}

// const uploadPhotoProfile = async (
//   req: AuthMiddlewareRequest,
//   res: Response
// ): Promise<any> => {
//   const { file, email } = req;

//   if (!email) {
//     return res.status(403).json({
//       status: false,
//       message: "Please login before update photo profile",
//     });
//   }

//   if (!file) {
//     return res.status(400).json({
//       status: false,
//       message: "Please provide image",
//     });
//   }

//   console.log(typeof file.buffer);

//   const ext = file.mimetype.split("/")[1];

//   const date = new Date();
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();

//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");

//   const fileName = `profileImage_${email}_${day}${month}${year}_${hours}${minutes}${seconds}.${ext}`;

//   console.log(ext);
//   console.log(fileName);

//   const bucketName = process.env.BUCKET_NAME || "bucket-profile-moodify";

//   const objectUrl: string = await uploadPhotoToBucketGCS(
//     file.buffer,
//     fileName,
//     bucketName
//   );

//   const picUpdated = await prisma.user.update({
//     where: {
//       email: email,
//     },
//     data: {
//       urlphoto: objectUrl,
//     },
//   });

//   if (!picUpdated) {
//     return res.status(500).json({
//       status: false,
//       message: "Failed upload photo due to server error",
//       imageUrl: objectUrl,
//     });
//   }

//   return res.status(200).json({
//     status: true,
//     message: "success upload image",
//     imageUrl: objectUrl,
//   });
// };

// export default uploadPhotoProfile;
