import { BaseRepository } from "./BaseRepository";

export class MoodOnJournalRepository extends BaseRepository {
    async getPercentage(journalId: string): Promise<any> {
        return await MoodOnJournalRepository._prisma.moodOnJournal.findFirst({
            where: {
                journalId: journalId,
            }
        })
    }
}