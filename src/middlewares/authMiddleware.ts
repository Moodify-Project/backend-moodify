import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";

// TODO: auth middleware lack of check and error handling
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    const authHeader: string = req.headers?.authorization || '';
    const refreshToken = req.cookies?.refreshToken;

    const token = authHeader.split(' ')[1];
    console.log(req.cookies);

    if (!refreshToken) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    const privateKey: string = process.env.JWT_PRIVATE_KEY || 'tes';
    const userDecoded: jwt.JwtPayload | string = jwt.verify(token, privateKey);

    if (typeof userDecoded !== 'string') {
        // email or username
        req.email = userDecoded.email;
        next();
    }

    try {
        // await prisma
    } catch (err) {

    }
}