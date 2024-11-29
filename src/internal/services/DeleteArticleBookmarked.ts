import { ArticleRepository } from "../repositories/ArticleRepository";
import { UserBookmarkArticleRepository } from "../repositories/BookmarkArticleRepository";

export class DeleteArticleBookmarked {
    private articleRepository: ArticleRepository;
    private userBookmarkArticleRepository: UserBookmarkArticleRepository;

    constructor(articleRepository: ArticleRepository, userBookmarkArticleRepository: UserBookmarkArticleRepository) {
        this.articleRepository = articleRepository;
        this.userBookmarkArticleRepository = userBookmarkArticleRepository;
    }

    execute = async (email: string, articleId: string) => {
        const articleIsExist = await this.articleRepository.findArticleById(articleId)
        .catch((error) => { throw new Error(`Can't find Article with ID: ${articleId} in Database`); });

        const deleteFromBookmark = await this.userBookmarkArticleRepository.deleteArticleFromBookmark(email, articleId)
        .catch((error) => { throw new Error(`Article not found in bookmark with email: ${email}`) });

        console.log(deleteFromBookmark);
    }
}