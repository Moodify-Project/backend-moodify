import { CookieOptions, Request, Response } from "express";
import { userLoginSchema, userRegisterSchema } from "../schemas/userSchemas";
import validateData from "../utils/validateData"
import jwt from 'jsonwebtoken';
import { generateRandom } from "../utils/generateRandom";

const loginHandler = (req: Request, res: Response): any => {
    if (!req.cookies) {
        return res.status(400).json({'error': 'error 400'});
    }
    const { username, password } = req.body;
    const loginData = validateData(userLoginSchema, { username, password });

    if(loginData instanceof Map) {
        const errReponseObj = Object.fromEntries(loginData);

        return res.status(404).json(errReponseObj);
    }

    // const user = await prisma.user.findUnique

    const privateKey: string = 'tes';
    const jwtAccessTokenOpt: jwt.SignOptions = { algorithm: 'HS256', expiresIn: '1d' };

    const accessToken = jwt.sign({ username: username }, privateKey, jwtAccessTokenOpt);
    const refreshToken = generateRandom(36);

    const cookieOption: CookieOptions = {
        httpOnly: true,
        // secure: true, // if https
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    return res.status(200).cookie('refreshToken', refreshToken, cookieOption)
    .json({ 
        accessToken: accessToken, 
        refreshToken: refreshToken 
    });
}

// export const refreshTokenHandler = (req: Request, res: Response) => {
//     const refreshToken = req.cookies['refreshToken'];
//     if (!refreshToken) {
//      }
// }



export const registerHandler = async (req: Request, res: Response) => {
    
    // const user = await prisma.user.create()
    
    return res.status(200);
} 

export default loginHandler;