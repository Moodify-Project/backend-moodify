import { Request, Response } from "express";
import { prisma } from "../configs/prisma";

interface AuthMiddlewareRequest extends Request {
    username?: string;
}

export const getAllProfileHandler = async (req: AuthMiddlewareRequest, res: Response) => {
    const usersData = await prisma.user.findUnique({
        where: {
            username: req.username
        }
    });

    const {

    } = usersData;

    return res.status(200).json({
        status: true,
        result: usersData,
    })
}

const editProfileHandler = async (req: AuthMiddlewareRequest, res: Response): Promise<any> => {
    const { name, gender, country } = req.body;

    const updatedUser = await prisma.user.update({
        where: {
            username: req.username,
        },
        data: {
            name: name,
            gender: gender,
            country: country,
        }
    });

    if (!updatedUser) {
        return res.status(500).json({
            status: false,
            message: 'failed to update'
        })
    }

    return res.status(500).json({
        status: false,
        message: updatedUser
    })
}

export default editProfileHandler;