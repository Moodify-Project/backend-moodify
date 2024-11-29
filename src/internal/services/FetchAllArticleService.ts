import { Article } from "../../../types/interfaces/interface.common";
import { redisClient } from "../configs/redis";
import { ArticleRepository } from "../repositories/ArticleRepository";
import { BaseRepository } from "../repositories/BaseRepository";

export class FetchAllArticleService {
    private baseRepository: BaseRepository;
    private articleRepository: ArticleRepository;

    constructor(baseRepository: BaseRepository, articleRepository: ArticleRepository) {
        this.baseRepository = baseRepository;
        this.articleRepository = articleRepository;
    }

    findAll = async (index: number): Promise<Article[]> => {
        const client = await redisClient().catch((error: any) => {
          throw new Error(error.message)
        })

        const cachedArticle: string | null =
        (await client?.get(`article-${index}`)) || null;

        if (cachedArticle) {
            return JSON.parse(cachedArticle);
        }

        const articles: any = await this.baseRepository.getAllArticleIdFromDB();

        const articleFixedCountBookmarked = articles.map((article: any) => ({
          ...article,
          bookmarkedCount: Number(article.bookmarkedCount),
        }));
      
        const { lengthOfArticle } = articleFixedCountBookmarked;
      
        const firstSeq = index * 10;
        const temp = firstSeq + 9;
        const lastSeq =
          temp > articleFixedCountBookmarked.length
            ? articleFixedCountBookmarked.length - 1
            : temp;
        const newArr: Article[] = [];
        for (let i = firstSeq; i <= lastSeq; i++) {
          newArr.push(articleFixedCountBookmarked[i]);
        }
      
        const expirationOption = {
          EX: 10000,
        };
      
        await client?.set(
          `article-${index}`,
          JSON.stringify(newArr),
          expirationOption
        );

        return newArr;
    }

    getDetailArticle = async (articleId: string): Promise<Article> => {
      return await this.articleRepository.findArticleById(articleId);
    }

}