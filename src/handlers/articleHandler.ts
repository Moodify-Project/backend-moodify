import { Response } from "express";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { BookmarkTheArticle } from "../internal/services/BookmarkTheArticle";
import { FetchAllArticleService } from "../internal/services/FetchAllArticleService";
import { ArticleBookmarkedByUserService } from "../internal/services/FindAllBookmarked";
import { FetchBookmarkedArticle } from "../internal/services/messaging/FetchBookmarkedArticle";
import { DeleteArticleBookmarked } from "../internal/services/DeleteArticleBookmarked";

export class ArticleHandler {
  private bookmarkTheArticle: BookmarkTheArticle;
  private fetchAllArticleService: FetchAllArticleService;
  private articleBookmarkedByUserService: ArticleBookmarkedByUserService;
  private fetchBookmarkedArticle: FetchBookmarkedArticle;
  private deleteArticleBookmarked: DeleteArticleBookmarked;

  constructor(bookmarkTheArticle: BookmarkTheArticle, fetchAllArticleService: FetchAllArticleService, articleBookmarkedByUserService: ArticleBookmarkedByUserService, fetchBookmarkedArticle: FetchBookmarkedArticle, deleteArticleBookmarked: DeleteArticleBookmarked) {
    this.bookmarkTheArticle = bookmarkTheArticle;
    this.fetchAllArticleService = fetchAllArticleService;
    this.articleBookmarkedByUserService = articleBookmarkedByUserService;
    this.fetchBookmarkedArticle = fetchBookmarkedArticle;
    this.deleteArticleBookmarked = deleteArticleBookmarked;
  }

  addArticleToBookmark = async (req: AuthenticatedRequest, res: Response): Promise<any> => {

    const { email, body } = req;
    const { articleId } = body;

    console.log(email);
  
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
        res.status(201).json({
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
        error: error.message,
        // message: "internal server error, contact the developer to start the service",
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
    });
  }

  unbookmarkArticle = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { email } = req;
    const { id } = req.params;

    
  }

  getSpecificArticleContent = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { articleId } = req.params;

    try {
      // const { id, source, author, title, description, url, urlToImage, publishedAt, content } = await this.fetchAllArticleService.getDetailArticle(articleId);
      const article = await this.fetchAllArticleService.getDetailArticle(articleId);

      return res.status(200).json({
        error: false,
        message: 'successfully fetch article',
        result: article
      })

    } catch(error: any) {

      return res.status(500).json({
        error: true,
        message: error.message
      })
    }
  }
  
  deleteBookmark = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const id: string = req.params.id;
    const email = req.email;

    if (!email) return res.status(400).json({ status: false, message: 'unathorized account' });
    try {
      await this.deleteArticleBookmarked.execute(email, id);

      return res.status(200).json({
        status: true,
        message: `successfully delete article with id ${id} from bookmark`
      })

    } catch (error: any) {
      console.log(error.message)

      return res.status(404).json({
        status: false,
        error: `can't delete article with id ${id}`,
        message: error.message
      })
    }
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
