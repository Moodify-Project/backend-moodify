import { Article } from "../../../../types/interfaces/interface.common";
import { ArticleRepository } from "../../repositories/ArticleRepository";
import { UserBookmarkArticleRepository } from "../../repositories/BookmarkArticleRepository"

export class FetchBookmarkedArticle {
    private userBookmarkArticleRepository: UserBookmarkArticleRepository;
    private articleRepository: ArticleRepository;

    constructor(userBookmarkArticleRepository: UserBookmarkArticleRepository, articleRepository: ArticleRepository) {
        this.userBookmarkArticleRepository = userBookmarkArticleRepository;
        this.articleRepository = articleRepository;
    }
    
    findAll = async(email: string): Promise<Article[]> => {
        const idCollections = await this.userBookmarkArticleRepository.findBookmarkedArticleByUser(email);

        const tempCollection: string[] = [];
        idCollections.map((collection) => {
            tempCollection.push(collection.articleId);
        });

        return await this.articleRepository.findAllArticleBookmarkedByUser(tempCollection);
    }
}