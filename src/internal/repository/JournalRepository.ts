import { Journal } from "../../entity/journalEntity";
import { BaseRepository } from "./baseRepository";

export class JournalRepository extends BaseRepository {
    async createNew(journal: Journal): Promise<Journal> {
        return await JournalRepository._prisma.journal.create({
            data: {
                emailAuthor: journal.emailAuthor,
                journalId: journal.journalId,
                content: journal.content,
                createdAt: journal.createdAt,
                updatedAt: journal.updatedAt,
            }
        });
    }

    async findOneJournal(email: string, equalDate: string): Promise<Journal> {
        return await JournalRepository._prisma.journal.findFirstOrThrow({
            where: {
                createdAt: {
                    lte: new Date(`${equalDate} 00:00:00`),
                    gte: new Date(`${equalDate} 23:59:59`),
                },
                emailAuthor: email,
            }
        })
    }
}
