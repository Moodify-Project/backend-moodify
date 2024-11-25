import { Response } from "express";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { BookmarkTheArticle } from "../internal/services/BookmarkTheArticle";
import { FetchAllArticleService } from "../internal/services/FetchAllArticleService";
import { ArticleBookmarkedByUserService } from "../internal/services/FindAllBookmarked";
import { FetchBookmarkedArticle } from "../internal/services/messaging/FetchBookmarkedArticle";

export class ArticleHandler {
  private bookmarkTheArticle: BookmarkTheArticle;
  private fetchAllArticleService: FetchAllArticleService;
  private articleBookmarkedByUserService: ArticleBookmarkedByUserService;
  private fetchBookmarkedArticle: FetchBookmarkedArticle;

  constructor(bookmarkTheArticle: BookmarkTheArticle, fetchAllArticleService: FetchAllArticleService, articleBookmarkedByUserService: ArticleBookmarkedByUserService, fetchBookmarkedArticle: FetchBookmarkedArticle) {
    this.bookmarkTheArticle = bookmarkTheArticle;
    this.fetchAllArticleService = fetchAllArticleService;
    this.articleBookmarkedByUserService = articleBookmarkedByUserService;
    this.fetchBookmarkedArticle = fetchBookmarkedArticle;
  }

  addArticleToBookmark = async (req: AuthenticatedRequest, res: Response): Promise<any> => {

    const { email, body } = req;
    const { articleId } = body;
  
    if (!email) {
      return res.status(401).json({
        status: false,
        message: "Please provide email, user didn't authenticated",
      });
    }
  
    if (!articleId) {
      return res.status(400).json({
        status: false,
        message: "Please provide ArticleId request body",
      });
    }
    
    try {
      const articleSuccessBookmarked = await this.bookmarkTheArticle.execute(email, articleId);

      if (articleSuccessBookmarked) {
        res.status(200).json({
          status: true,
          message: `Success bookmarked article with id: ${articleId}`,
        })
      }

    } catch (err) {
      console.log("Conflict error: ", err);
      res.status(409).json({
        status: false,
        message: 'User already bookmarked this article'
      })
    }
  }

  getAllArticle = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const index: number = Number(req.query.index) || 0;

    try {

      const newArr = await this.fetchAllArticleService.findAll(index);

      return res.status(200).json({
        status: true,
        message: "success get article from DB",
        index: index,
        totalArticle: newArr.length,
        data: newArr,
      });

    } catch(error: any) {

      if (error.message === 'Invalid URL') {
        return res.status(503).json({
          status: false,
          message: "Check whether url of Redis server is valid pr not",
          error: error.message
        });
      }

      return res.status(500).json({
        status: false,
        message: "internal server error, contact the developer to start the service",
      })

    }
  }

  showAllBookmarkedArticle = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { email } = req;

    if (!email) return res.status(403).json({ status: false, message: 'Email cant access to this endpoint' });
    
    const result = await this.fetchBookmarkedArticle.findAll(email);

    return res.status(200).json({
      status: true,
      message: `successfully fetch bookmark article for user with email: ${email}`,
      articles: result,
    })
  }

  // getAllBookmarkedByUser = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  //   const { email, body } = req;
  //   if (!email) {
  //     return res.status(401).json({
  //       error: true,
  //       message: 'User need to authenticate first'
  //     })
  //   }

  //   const articlesBookmarked = await this.articleBookmarkedByUserService.findAll(email);

  //   res.status(200).json({
  //     error: true,
  //     message: 'Successfully fetch all bookmark data from user',
  //     result: articlesBookmarked
  //   })
  // }
}
