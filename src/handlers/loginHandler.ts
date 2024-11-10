import { CookieOptions, Request, Response } from "express";
import { userLoginSchema, userRegisterSchema } from "../schemas/userSchemas";
import validateData from "../utils/validateData"
import jwt from 'jsonwebtoken';
import { generateRandom } from "../utils/generateRandom";
import { prisma } from "../configs/prisma";
import generateHashedPassword, { checkedPassword } from "../utils/hashPassword";

const loginHandler = async (req: Request, res: Response): Promise<any> => {
    if (!req.cookies) {
        return res.status(400).json({'error': 'error 400'});
    }
    const { email, password } = req.body;
    const loginData = validateData(userLoginSchema, { email, password });

    if(loginData instanceof Map) {
        const errReponseObj = Object.fromEntries(loginData);

        return res.status(404).json(errReponseObj);
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    const passVerified = checkedPassword(password, user.password);

    if (!passVerified) {
        res.status(403).json({
            status: false,
            message: 'Email or password wrong',
        })
    }

    const privateKey: string = 'tes';
    const jwtAccessTokenOpt: jwt.SignOptions = { algorithm: 'HS256', expiresIn: '1d' };

    const accessToken = jwt.sign({ username: user.username }, privateKey, jwtAccessTokenOpt);
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

    const { name, email, password } = req.body;

    const saltRounds = 10;

    const hashedPass = generateHashedPassword(saltRounds, password);
    
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPass,
        }
    })
    
    return res.status(200).json(user);
} 

export default loginHandler;