// import { Request, Response } from "express";
// import { prisma } from "../internal/configs/prisma";
// import { gender_type } from "@prisma/client";

// interface AuthMiddlewareRequest extends Request {
//   email?: string;
// }

// export const getAllProfileHandler = async (
//   req: AuthMiddlewareRequest,
//   res: Response
// ) => {
//   const usersData = await prisma.user.findUnique({
//     where: {
//       email: req.email,
//     },
//   });

//   // const {
//   //     email,
//   //     username,
//   //     name,
//   //     gender,
//   //     country
//   // } = usersData;

//   return res.status(200).json({
//     status: true,
//     result: usersData,
//   });
// };

// const editProfileHandler = async (
//   req: AuthMiddlewareRequest,
//   res: Response
// ): Promise<any> => {
//   if (!req.body) {
//     return res.status(400).json({
//       status: false,
//       message: "Can't update profile due to lack of request body",
//     });
//   }

//   const { name, gender, country, url_photo } = req.body;

//   const updatedUser = await prisma.user.update({
//     where: {
//       email: req.email,
//     },
//     data: {
//       name: name,
//       gender: gender,
//       country: country,
//     },
//   });

//   if (!updatedUser) {
//     return res.status(500).json({
//       status: false,
//       message: "failed to update",
//     });
//   }

//   return res.status(500).json({
//     status: false,
//     message: updatedUser,
//   });
// };

// export default editProfileHandler;
