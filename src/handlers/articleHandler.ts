import { Request, Response } from "express";
import { BaseRepository } from "../internal/repositories/BaseRepository";
import { Transaction } from "../internal/repositories/Transaction";
import { redisClient } from "../internal/configs/redis";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { BookmarkTheArticle } from "../internal/services/BookmarkTheArticle";
import { FetchAllArticleService } from "../internal/services/FetchAllArticleService";
import { ArticleBookmarkedByUserService } from "../internal/services/FindAllBookmarked";

// export interface Article {
//   id: string;
//   source: string;
//   author: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
//   publishedAt: string;
//   content: string;
//   bookmarkCount: number;
// }

export class ArticleHandler {
  private bookmarkTheArticle: BookmarkTheArticle;
  private fetchAllArticleService: FetchAllArticleService;
  private articleBookmarkedByUserService: ArticleBookmarkedByUserService;

  constructor(bookmarkTheArticle: BookmarkTheArticle, fetchAllArticleService: FetchAllArticleService, articleBookmarkedByUserService: ArticleBookmarkedByUserService) {
    this.bookmarkTheArticle = bookmarkTheArticle;
    this.fetchAllArticleService = fetchAllArticleService;
    this.articleBookmarkedByUserService = articleBookmarkedByUserService;
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

  // getAllBookmarkedByUser = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  //   const { email, body } = req;
  //   if (!email) {
  //     res.status(401).json({
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

// export const getAllArticle = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const client = await redisClient();
//   const index: number = Number(req.query.index) || 0;

//   const articleRepository = new BaseRepository();
//   const cachedArticle: string | null =
//     (await client.get(`article-${index}`)) || null;
//   if (cachedArticle) {
//     const parsedArticles = JSON.parse(cachedArticle);
//     const newResponse = {
//       status: "success",
//       index: index,
//       totalArticle: parsedArticles.length,
//       result: parsedArticles,
//     };
//     return res.status(200).json(newResponse);
//   }

//   const articles: any = await articleRepository.getAllArticleIdFromDB();

//   const articleFixedCountBookmarked = articles.map((article: any) => ({
//     ...article,
//     bookmarkedCount: Number(article.bookmarkedCount),
//   }));

//   const { lengthOfArticle } = articleFixedCountBookmarked;

//   const firstSeq = index * 10;
//   const temp = firstSeq + 9;
//   const lastSeq =
//     temp > articleFixedCountBookmarked.length
//       ? articleFixedCountBookmarked.length - 1
//       : temp;
//   const newArr: Article[] = [];
//   for (let i = firstSeq; i <= lastSeq; i++) {
//     newArr.push(articleFixedCountBookmarked[i]);
//   }

//   const expirationOption = {
//     EX: 10000,
//   };

//   await client.set(
//     `article-${index}`,
//     JSON.stringify(newArr),
//     expirationOption
//   );

//   return res.status(200).json({
//     status: true,
//     message: "success get article from DB",
//     index: index,
//     totalArticle: newArr.length,
//     data: newArr,
//   });
// };


// export const addArticleToBookmark = async (
//   req: AuthMiddlewareRequest,
//   res: Response
// ): Promise<any> => {

//   const userOnArticle = new Transaction();
//   try {
//     const articleBookmarked =
//       await userOnArticle.findOneThrowErrOrCreateBookmark(email, articleId);
//     // if (!articleBookmarked) {
//     //     return res.status(404).json({
//     //         status: false,
//     //         message: 'Article you want to bookmark is not found',
//     //     })
//     // }

//     const client = await redisClient();

//     const articles = await client.keys('article-*');
//     for (const article of articles) {
//       await client.del(article);
//     } 

//     return res.status(200).json({
//       status: true,
//       message: "success bookmark an article",
//     });
//   } catch (error: any) {
//     console.log(error);
//     return res.status(409).json({
//       status: false,
//       error: error.message,
//     });
//   }
// };
