import { UserBookmarkArticleRepository } from "../repositories/BookmarkArticleRepository";

export class ArticleBookmarkedByUserService {
    private userBookmarkArticleRepository: UserBookmarkArticleRepository;

    constructor(userBookmarkArticleRepository: UserBookmarkArticleRepository) {
        this.userBookmarkArticleRepository = userBookmarkArticleRepository;
    }

    findAll = async (email: string) => {
        await this.userBookmarkArticleRepository.findBookmarkedArticleByUser(email);
    }
}