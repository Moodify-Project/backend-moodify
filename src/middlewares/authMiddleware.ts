import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface MiddlewareRequest extends Request {
    username?: string;
}

export const authMiddleware = async (req: MiddlewareRequest, res: Response, next: NextFunction): Promise<any> => {
    const authHeader: string = req.headers?.authorization || '';
    const refreshToken = req.cookies?.refreshToken;

    const token = authHeader.split(' ')[1];
    console.log(req.cookies);
    
    if (!refreshToken) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    const privateKey = 'tes';
    const userDecoded: jwt.JwtPayload | string = jwt.verify(token, privateKey);

    if (typeof userDecoded !== 'string') {
        req.username = userDecoded.username;
        next();
    }

    try {
        // await prisma
    } catch (err) {

    }
}