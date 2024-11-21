import { Router } from "express";
import { authRouter } from "./authRoute";
import { articleRouter } from "./articleRoute";
import { journalRouter } from "./journalRoute";
import { profileRouter } from "./profileRoute";

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/articles', articleRouter);
mainRouter.use('/journals', journalRouter);
mainRouter.use('/profiles', profileRouter);

export { mainRouter };