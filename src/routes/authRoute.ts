import { Router } from "express";
import { UserRepository } from "../internal/repositories/UserRepository";
import { LoginService } from "../internal/services/LoginService";
import { RegisterService } from "../internal/services/RegisterService";
import { AuthenticationHandler } from "../handlers/authenticationHandler";
import { RefreshTokenService } from "../internal/services/RefreshTokenService";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

const userRepository = new UserRepository();

const loginService = new LoginService(userRepository);
const registerService = new RegisterService(userRepository);
const refreshTokenService = new RefreshTokenService(userRepository);

const authHandler = new AuthenticationHandler(loginService, registerService, refreshTokenService);

authRouter.post('/login', authHandler.loginAccount);
authRouter.post('/register', authHandler.registerAccount);
authRouter.post('/refresh_token', authMiddleware, authHandler.useRefreshToken);

export { authRouter }