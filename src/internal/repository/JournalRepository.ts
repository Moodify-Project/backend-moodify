import { Journal } from "../../entity/journalEntity";
import { BaseRepository } from "./BaseRepository";

export class JournalRepository extends BaseRepository {
    async findOneJournal(email: string, equalDate: string): Promise<Journal> {
        return await JournalRepository._prisma.journal.findFirstOrThrow({
            where: {
                createdAt: {
                    gte: new Date(`${equalDate} 00:00:00`),
                    lte: new Date(`${equalDate} 23:59:59`),
                },
                emailAuthor: email,
            }
        })
    }
    
    async createNew(journal: Journal): Promise<Journal> {
        return await JournalRepository._prisma.journal.create({
            data: {
                emailAuthor: journal.emailAuthor,
                journalId: journal.journalId,
                content: journal.content,
                createdAt: journal.createdAt,
                updatedAt: journal.updatedAt,
                isPredicted: journal.isPredicted,
            }
        });
    }

    async findJournalById(journalId: string): Promise<any> {
        return await JournalRepository._prisma.journal.findUnique({
            where: {
                journalId: journalId
            }
        })
    }

    async updateJournalById(journalId: string, journal: Journal): Promise<Journal> {
        return await JournalRepository._prisma.journal.update({
            where: {
                journalId: journalId
            },
            data: {
                content: journal.content,
                updatedAt: journal.updatedAt,
            }
        })
    }

    async journalIsPredicted(journalId: string): Promise<Journal> {
        return await JournalRepository._prisma.journal.update({
            where: {
                journalId: journalId
            },
            data: {
                isPredicted: true
            }
        })

    }
}
