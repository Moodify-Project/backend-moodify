import { Router } from "express";
import { ArticleHandler } from "../handlers/articleHandler";
import { BookmarkTheArticle } from "../internal/services/BookmarkTheArticle";
import { FetchAllArticleService } from "../internal/services/FetchAllArticleService";
import { BaseRepository } from "../internal/repositories/BaseRepository";
import { UserBookmarkArticleRepository } from "../internal/repositories/BookmarkArticleRepository";
import { authMiddleware } from "../middlewares/authMiddleware";

const articleRouter = Router();

const baseRepository = new BaseRepository();
const userBookmarkArticleRepository = new UserBookmarkArticleRepository();

const bookmarkTheArticle = new BookmarkTheArticle(userBookmarkArticleRepository);
const fetchAllArticleService = new FetchAllArticleService(baseRepository);

const articleHandler = new ArticleHandler(bookmarkTheArticle, fetchAllArticleService);

articleRouter.get('/', authMiddleware, articleHandler.getAllArticle);
articleRouter.post('/bookmark', authMiddleware, articleHandler.addArticleToBookmark); // coba consider pake PUT

export { articleRouter };