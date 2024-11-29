import { gender_type } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { User } from "../../domain/entities/User";

export class UserRepository extends BaseRepository {
    findUserByEmail = async (email: string) => {
        return await UserRepository._prisma.user.findUniqueOrThrow({
            where: {
              email: email,
            },
        })
    }

    createNewAccount = async (email: string, username: string, hashedPass: string) => {
        return await UserRepository._prisma.user.create({
            data: {
              email: email,
              username: username,
              password: hashedPass,
              gender: gender_type.secret,
              name: "",
              country: "Not Representing",
            },
        });
    }

    updatePhotoProfileUser = async (email: string, imageUrl: string) => {
        return await UserRepository._prisma.user.update({
            where: {
                email: email,
            },
            data: {
                urlphoto: imageUrl,
            },
      });
    }

    updateInformationProfileUser = async (email: string, name?: string, gender?: gender_type, country?: string) => {
        return await UserRepository._prisma.user.update({
            where: {
              email: email,
            },
            data: {
              name: name,
              gender: gender,
              country: country,
            },
        });
    }

    findMatchedRefreshToken = async (email: string) => {
        return await UserRepository._prisma.user.findFirstOrThrow({
            where: {
                email: email
            },
            select: {
                refreshtoken: true
            }
        })
    }

    updateRefreshToken = async (email: string, refreshToken: string) => {
        return await UserRepository._prisma.user.update({
            data: {
                refreshtoken: refreshToken
            },
            where: {
                email: email
            }
        })
    }
}