import { Response } from "express";
import { UploadPhotoUser } from "../internal/services/UploadPhotoUser";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { UpdateProfileUser } from "../internal/services/UpdateProfileUser";
import { SpecificInfoUser } from "../internal/services/SpecificInfoUser";
import validateData from "../utils/validateData";
import { editProfileUserSchema } from "../schemas/userSchemas";


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

    try {
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

    } catch (error: any) {
      
      const errorMsg = JSON.parse(error.message);

      console.log(errorMsg);
  
      return res.status(400).json({
        status: false,
        error_msg: errorMsg,
      });
    }

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