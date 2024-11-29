import { userLoginSchema } from "../../schemas/userSchemas";
import { generateRandom } from "../../utils/generateRandom";
import { checkedPassword } from "../../utils/hashPassword";
import validateData from "../../utils/validateData";
import { UserRepository } from "../repositories/UserRepository";
import jwt from "jsonwebtoken";

export class LoginService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute = async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> => {
        const loginData = validateData(userLoginSchema, { email, password });

        if (loginData instanceof Map) {
            const errReponseObj = Object.fromEntries(loginData);
            throw new Error(JSON.stringify(errReponseObj));
            // return res.status(404).json(errReponseObj);
        }

        const user = await this.userRepository.findUserByEmail(email);

        if (!user) {
            throw new Error('EmailNotFound')
        }

        const passVerified = await checkedPassword(password, user.password);

        if (!passVerified) {
            throw new Error('EmailAndPasswordNotMatch')
        }

        const privateKey: string = process.env.JWT_PRIVATE_KEY || "tes";
        const jwtAccessTokenOpt: jwt.SignOptions = {
          algorithm: "HS256",
          expiresIn: "1d",
        };

        const accessToken: string = jwt.sign(
            { email: user.email },
            privateKey,
            jwtAccessTokenOpt
          );

        const refreshToken: string = generateRandom(36);

        return {
            accessToken,
            refreshToken
        }
    }

    updateUserRefreshToken = async (email: string, refreshToken: string): Promise<void> => {
        const updatedToken = await this.userRepository.updateRefreshToken(email, refreshToken);

        if (!updatedToken) throw new Error('internal server error when want to update refresh token');

        console.log('successfully update refresh token');
    }

}