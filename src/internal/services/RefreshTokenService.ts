import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { checkedPassword } from "../../utils/hashPassword";
import { UserRepository } from "../repositories/UserRepository";
import jwt from 'jsonwebtoken';

export interface RefreshToken {
    newAccessToken?: string;
    expiredNewAccToken?: string;
    comparedToken: boolean;
} 


export class RefreshTokenService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    fetch = async(email: string, clientRefreshToken: string, expTimeRefreshToken: Date): Promise<RefreshToken> => {

        const currDate = Date.now();

        const currentTimestamp = new Date(currDate);

        const expTimestamp = new Date(expTimeRefreshToken);

        if (expTimestamp <= currentTimestamp) throw new Error('token has expired');

        const user = await this.userRepository.findMatchedRefreshToken(email);

        if (!user || !user.refreshtoken) throw new Error('Refresh token not found in database');

        const refreshTokenFromDB = user.refreshtoken;

        const errCheckCompare = await checkedPassword(clientRefreshToken, refreshTokenFromDB);

        console.log(errCheckCompare);

        if (!errCheckCompare) return { comparedToken: false };

        const payloadJwt: JwtPayload = { email };
        const privateKey: string = process.env.JWT_PRIVATE_KEY || "tes";
        const jwtAccessTokenOpt: jwt.SignOptions = {
          algorithm: "HS256",
          expiresIn: "1d",
        };

        const newAccessToken = jwt.sign(payloadJwt, privateKey, jwtAccessTokenOpt);

        const expNewRefreshToken = new Date(currDate + 7 * 24 * 60 * 60 * 1000).toISOString();

        const result = {
            newAccessToken,
            expiredNewAccToken: expNewRefreshToken,
            comparedToken: true
        }

        return result
    }

    updateRefreshTokenInDB = async(email: string, refreshToken: string): Promise<void> => {
        const updatedToken = await this.userRepository.updateRefreshToken(email, refreshToken);

        if(!updatedToken) throw new Error(`can't update token, error when updating refresh token for user: ${refreshToken}`)
    }
}