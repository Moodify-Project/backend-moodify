import { CookieOptions, Request, Response } from "express";
import { userLoginSchema, userRegisterSchema } from "../schemas/userSchemas";
import validateData from "../utils/validateData";
import jwt from 'jsonwebtoken';
import { generateRandom } from "../utils/generateRandom";
import { prisma } from "../configs/prisma";
import generateHashedPassword, { checkedPassword } from "../utils/hashPassword";
import { gender_type, Prisma } from "@prisma/client";

interface User {
    username: string;
    email: string;
    password: string;
}

const loginHandler = async (req: Request, res: Response): Promise<any> => {
    if (!req.cookies) {
        return res.status(400).json({ 'error': 'error 400' });
    }
    const { email, password } = req.body;
    const loginData = validateData(userLoginSchema, { email, password });

    if (loginData instanceof Map) {
        const errReponseObj = Object.fromEntries(loginData);
        return res.status(404).json(errReponseObj);
    }

    const user: User | null = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const passVerified = await checkedPassword(password, user.password);

    if (!passVerified) {
        return res.status(403).json({
            status: false,
            message: 'Email or password wrong',
        });
    }

    const privateKey: string = 'tes';
    const jwtAccessTokenOpt: jwt.SignOptions = { algorithm: 'HS256', expiresIn: '1d' };

    const accessToken = jwt.sign({ email: user.email }, privateKey, jwtAccessTokenOpt);
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
            refreshToken: refreshToken,
        });
}

export const registerHandler = async (req: Request, res: Response): Promise<any> => {
    const { username, email, password } = req.body;
    const saltRounds = 10;

    const hashedPass: any = await generateHashedPassword(saltRounds, password);

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPass,
                gender: gender_type.secret,
                name: '',
                country: 'Not Representing'
            }
        });

        return res.status(200).json(user);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(404).json({
                success: false,
                message: 'Username or email already registered',
            });
        }
        return res.status(500).json({
            success: false,
            message: error,
        });
    }
}

export default loginHandler;
