import { Request, Response } from "express";
import { BaseRepository } from "../internal/repository/BaseRepository";
import { Transaction } from "../internal/repository/Transaction";
import { redisClient } from "../configs/redis";

interface Article {
    id: string;
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
    bookmarkCount: number;
}

interface AuthMiddlewareRequest extends Request {
    email?: string;
}


export const addArticleToBookmark = async (req: AuthMiddlewareRequest, res: Response): Promise<any> => {
    const { email, body } = req;
    const { articleId } = body;

    if (!email) {
        return res.status(403).json({
            status: false,
            message: 'Please login'
        })
    }

    if (!articleId) {
        return res.status(400).json({
            status: false,
            message: 'Please provide ArticleId request body'
        })
    }

    const userOnArticle = new Transaction();
    try {
        const articleBookmarked = await userOnArticle.findOneThrowErrOrCreateBookmark(email, articleId);
        // if (!articleBookmarked) {
        //     return res.status(404).json({
        //         status: false,
        //         message: 'Article you want to bookmark is not found',
        //     })
        // }

        return res.status(200).json({
            status: true,
            message: 'success bookmark an article',
        })

    } catch(error: any) {
        console.log(error);
        return res.status(409).json({
            status: false,
            error: error.message,
        })
    }
};

export const getAllArticle = async (req: Request, res: Response): Promise<any> => {
    const client = await redisClient();
    const index: number = Number(req.query.index) || 0;

    const articleRepository = new BaseRepository();
    const cachedArticle: string | null = await client.get(`article-${index}`) || null;
    if (cachedArticle) {
        const parsedArticles = JSON.parse(cachedArticle);
        const newResponse = {
            status: 'success',
            index: index,
            totalArticle: parsedArticles.length, 
            result: parsedArticles
        }
        return res.status(200).json(newResponse); 
    }

    const articles: any = await articleRepository.getAllArticleIdFromDB();

    const articleFixedCountBookmarked = articles.map((article: any) => ({
        ...article,
        bookmarkedCount: Number(article.bookmarkedCount)
    }))
    
    const { lengthOfArticle } = articleFixedCountBookmarked;

    const firstSeq = index * 10;
    const temp = firstSeq + 9;
    const lastSeq = temp > articleFixedCountBookmarked.length ? articleFixedCountBookmarked.length - 1 : temp;
    const newArr: Article[] = [];
    for (let i = firstSeq; i <= lastSeq; i++) {
        newArr.push(articleFixedCountBookmarked[i]);
    }

    const expirationOption = {
        EX: 10000
    }

    await client.set(`article-${index}`, JSON.stringify(newArr), expirationOption); 

    return res.status(200).json({
        status: true,
        message: 'success get article from DB',
        index: index,
        totalArticle: newArr.length,
        data: newArr,
    })



    // const indexToNum = Number(req.query.index) || 0;

    // if(myCache.get(`news-${indexToNum}`)) {
    //     const allNewsData: News[] = myCache.get(`news-${indexToNum}`) || [];

    //     const newResponse = {
    //         status: 'success',
    //         index: indexToNum,
    //         totalArticle: allNewsData.length, 
    //         result: allNewsData
    //     }
    //     return res.status(200).json(newResponse); 
    // }

    // const url = `https://newsapi.org/v2/everything?domains=forbes.com&q=mental&from=${queryDate}&apiKey=${API_KEY_NEWS}`;

    // axios.get(url)
    //     .then((response) => {
    //         const { status, totalResults, articles } = response.data;
    //         // const getDozens = totalResults.toString();
    //         // const dozensIndex = getDozens.slice(0, getDozens.length - 1);

            
            
    //         const firstSeq = indexToNum * 10;
    //         const temp = firstSeq + 9;
    //         const lastSeq = temp > totalResults ? totalResults : temp;
    //         const newArr = [];
    //         for (let i = firstSeq; i < lastSeq; i++) {
    //             newArr.push(articles[i]);
    //         }

    //         myCache.set(`news-${indexToNum}`, newArr, 10000);

    //         const newResponse = {
    //             status: 'success',
    //             index: indexToNum,
    //             totalArticle: newArr.length, 
    //             result: newArr
    //         }
    //         return res.status(200).json(newResponse);
    //     })
    //     .catch((err) => {
    //         console.log(`Error: ${err}`);
    //         return res.status(500).json({
    //             status: 'failed',
    //             error: err
    //         });
    //     });
}