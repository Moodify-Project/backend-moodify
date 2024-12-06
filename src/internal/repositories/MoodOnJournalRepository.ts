import { BaseRepository } from "./BaseRepository";

export interface MoodOnJournal {
    moodId: number;
    journalId: string;
    percentage: number;
}

export class MoodOnJournalRepository extends BaseRepository {
    async getPercentage(journalId: string): Promise<any> {
        return await MoodOnJournalRepository._prisma.moodOnJournal.findFirst({
            where: {
                journalId: journalId,
            }
        })
    }

    getAllMoods = async (journalId: string, tx?: any): Promise<any> => {
        if (!tx) {
            return await MoodOnJournalRepository._prisma.moodOnJournal.findMany({
                where: { journalId: journalId },
            });
        }
        
        const moods = await tx.moodOnJournal.findMany({
            where: { journalId: journalId },
        });
        
        return moods;
    };
    
    getJournalEveryWeekly = async(journalIds: string[]) => {
        return await MoodOnJournalRepository._prisma.moodOnJournal.findMany({
            where: {
                journalId: {
                    in: journalIds
                },
            },
        });
    }

    postNewMoodOnPredictedJournal = async (moodData: MoodOnJournal[]) => {
        return await MoodOnJournalRepository._prisma.moodOnJournal.createMany({
            data: moodData
        })
    }
}