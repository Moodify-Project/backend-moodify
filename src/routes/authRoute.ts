import { Router } from "express";
import { UserRepository } from "../internal/repositories/UserRepository";
import { LoginService } from "../internal/services/LoginService";
import { RegisterService } from "../internal/services/RegisterService";
import { AuthenticationHandler } from "../handlers/authenticationHandler";

const authRouter = Router();

const userRepository = new UserRepository();

const loginService = new LoginService(userRepository);
const registerService = new RegisterService(userRepository);

const authHandler = new AuthenticationHandler(loginService, registerService);

authRouter.post('/login', authHandler.loginAccount);
authRouter.post('/register', authHandler.registerAccount);

export { authRouter }