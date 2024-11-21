import { getTodayDateString } from "../../utils/todayString";
import { prisma } from "../configs/prisma";
import { JournalRepository } from "../repositories/JournalRepository";
import { MoodOnJournalRepository } from "../repositories/MoodOnJournalRepository";

export class MoodOnJournalServices {
    private journalRepository: JournalRepository;
    private moodOnJournalRepository: MoodOnJournalRepository;

    constructor(journalRepository: JournalRepository, moodOnJournalRepository: MoodOnJournalRepository) {
        this.journalRepository = journalRepository;
        this.moodOnJournalRepository = moodOnJournalRepository;
    }

    findAll = async (email: string) => {
        const todayString = getTodayDateString();
        
        return await prisma.$transaction(async (tx) => {
            const journal = await this.journalRepository.findOneJournal(email, todayString, tx);
            const { journalId } = journal;

            if (!journalId) {
                throw new Error(
                  `Journal not found for email: ${email} on date: ${todayString}`
                );
            }

            const moods = await this.moodOnJournalRepository.getAllMoods(journalId, tx);

            return moods;
        })
    }
}