import { CookieOptions, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { LoginService } from "../internal/services/LoginService";
import { RegisterService } from "../internal/services/RegisterService";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { RefreshTokenService } from "../internal/services/RefreshTokenService";
import generateHashedPassword from "../utils/hashPassword";


export class AuthenticationHandler {
  private loginService: LoginService;
  private registerService: RegisterService;
  private refreshTokenService: RefreshTokenService;

  constructor(loginService: LoginService, registerService: RegisterService, refreshTokenService: RefreshTokenService) {
    this.loginService = loginService;
    this.registerService = registerService;
    this.refreshTokenService = refreshTokenService;
  }

  loginAccount = async (req: Request, res: Response): Promise<any> => {

    if (!req.cookies) {
      return res.status(400).json({ error: "error 400" });
    }
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken } = await this.loginService.execute(email, password);

      const cookieOption: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const hashedRefreshToken = await generateHashedPassword(10, refreshToken);

      console.log(hashedRefreshToken);

      await this.loginService.updateUserRefreshToken(email, hashedRefreshToken);
    
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json({
          status: true,
          message: "login successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

    } catch (error: any) {
      if (error.message === 'EmailNotFound') {
        return res.status(404).json({
          status: false, 
          error: "Email not found",
        });
      } else if (error.message === 'EmailAndPasswordNotMatch') {
        return res.status(404).json({
          status: false, 
          error: "Email and password you inputted doesn't match",
        });
      } else {
        return res.status(400).json({
          status: false, 
          error: error.message
        });
      }
    }
  }

  registerAccount = async (req: Request, res: Response): Promise<any> => {
    const { username, email, password } = req.body;

    try {
      await this.registerService.execute(email, username, password);

      return res.status(201).json({
        success: true,
        message: 'success registered',
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(404).json({
          success: false,
          message: "Username or email already registered",
        });
      }
      else {
        const errorMsg = JSON.parse(error.message);

        console.log(errorMsg);

        return res.status(422).json({
          status: false,
          message: "Validation error when create new account",
          errors: errorMsg,
        });
      }
    }
  }
  useRefreshToken = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const refresh_token = req.cookies.refreshToken;
    const { email } = req;
    const { expiredDate } = req.body;
  
    if (!email) {
      return res.status(401).json({ error: true, message: 'User not authorized' });
    }
  
    if (!refresh_token) {
      return res.status(403).json({ error: true, message: 'No refresh token provided. Please log in again.' });
    }
  
    try {
      const tokenObject = await this.refreshTokenService.fetch(email, refresh_token, expiredDate);
      const { newAccessToken, expiredNewAccToken, comparedToken } = tokenObject;
  
      if (!comparedToken) {
        return res.status(404).json({ error: true, message: 'Refresh token does not match' });
      }
  
      // await this.refreshTokenService.updateRefreshTokenInDB(email, refresh_token);
  
      return res.status(200).json({
        error: false,
        message: 'Successfully refreshed token',
        accessToken: newAccessToken,
        expiredDate: expiredNewAccToken,
      });
    } catch (error: any) {
      return res.status(500).json({
        error: true,
        message: `internal server error, ${error.message}`,
      });
    }
  };
}  