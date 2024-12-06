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
import { DeleteArticleBookmarked } from "../internal/services/DeleteArticleBookmarked";

const articleRouter = Router();

const baseRepository = new BaseRepository();
const userBookmarkArticleRepository = new UserBookmarkArticleRepository();
const articleRepository = new ArticleRepository();

const bookmarkTheArticle = new BookmarkTheArticle(userBookmarkArticleRepository, articleRepository);
const fetchAllArticleService = new FetchAllArticleService(baseRepository, articleRepository, userBookmarkArticleRepository);
const articleBookmarkedByUserService = new ArticleBookmarkedByUserService(userBookmarkArticleRepository);
const fetchBookmarkedArticle = new FetchBookmarkedArticle(userBookmarkArticleRepository, articleRepository);
const deleteArticleBookmarked = new DeleteArticleBookmarked(articleRepository, userBookmarkArticleRepository);

const articleHandler = new ArticleHandler(bookmarkTheArticle, fetchAllArticleService, articleBookmarkedByUserService, fetchBookmarkedArticle, deleteArticleBookmarked);

articleRouter.get('/', authMiddleware, articleHandler.getAllArticle);
articleRouter.get('/:id', authMiddleware, articleHandler.getSpecificArticleContent);
articleRouter.post('/bookmark', authMiddleware, articleHandler.addArticleToBookmark);
articleRouter.delete('/:id/bookmark', authMiddleware, articleHandler.deleteBookmark);
articleRouter.get('/bookmarks/me', authMiddleware, articleHandler.showAllBookmarkedArticle);

export { articleRouter };