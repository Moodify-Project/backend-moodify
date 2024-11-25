import { Router } from "express";
import { ArticleHandler } from "../handlers/articleHandler";
import { BookmarkTheArticle } from "../internal/services/BookmarkTheArticle";
import { FetchAllArticleService } from "../internal/services/FetchAllArticleService";
import { BaseRepository } from "../internal/repositories/BaseRepository";
import { UserBookmarkArticleRepository } from "../internal/repositories/BookmarkArticleRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ArticleBookmarkedByUserService } from "../internal/services/FindAllBookmarked";
import { FetchBookmarkedArticle } from "../internal/services/messaging/FetchBookmarkedArticle";
import { ArticleRepository } from "../internal/repositories/ArticleRepository";

const articleRouter = Router();

const baseRepository = new BaseRepository();
const userBookmarkArticleRepository = new UserBookmarkArticleRepository();
const articleRepository = new ArticleRepository();

const bookmarkTheArticle = new BookmarkTheArticle(userBookmarkArticleRepository);
const fetchAllArticleService = new FetchAllArticleService(baseRepository);
const articleBookmarkedByUserService = new ArticleBookmarkedByUserService(userBookmarkArticleRepository);
const fetchBookmarkedArticle = new FetchBookmarkedArticle(userBookmarkArticleRepository, articleRepository);

const articleHandler = new ArticleHandler(bookmarkTheArticle, fetchAllArticleService, articleBookmarkedByUserService, fetchBookmarkedArticle);

articleRouter.get('/', authMiddleware, articleHandler.getAllArticle);
articleRouter.post('/bookmark', authMiddleware, articleHandler.addArticleToBookmark); // coba consider pake PUT

export { articleRouter };