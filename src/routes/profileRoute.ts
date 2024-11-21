import { Router } from "express";
import { UserRepository } from "../internal/repositories/UserRepository";
import { SpecificInfoUser } from "../internal/services/SpecificInfoUser";
import { UpdateProfileUser } from "../internal/services/UpdateProfileUser";
import { UploadPhotoUser } from "../internal/services/UploadPhotoUser";
import { UserInformationHandler } from "../handlers/UserInformationHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";

const profileRouter = Router();

const userRepository = new UserRepository();

const specificInfoUser = new SpecificInfoUser(userRepository);
const updateProfileUser = new UpdateProfileUser(userRepository);
const uploadPhotoUser = new UploadPhotoUser(userRepository);

const profileHandler = new UserInformationHandler(uploadPhotoUser, updateProfileUser, specificInfoUser);

const storage = multer.memoryStorage();

const upload = multer({ storage });


profileRouter.get('/me', authMiddleware, profileHandler.getDetail);
profileRouter.put('/me', authMiddleware, profileHandler.updateProfile);
profileRouter.put('/photo', [authMiddleware, upload.single('image')], profileHandler.uploadPhotoProfile);

export { profileRouter };