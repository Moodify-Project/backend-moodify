import { Journal } from "../../domain/entities/Journal";
import { JournalRepository } from "../repositories/JournalRepository";

export class FindDailyJournal {
    private journalRepository: JournalRepository;
    
    constructor(journalRepository: JournalRepository) {
        this.journalRepository = journalRepository;
    }

    execute = async(email: string, date: string): Promise<Journal> => {
        return await this.journalRepository.findOneJournal(email, date);
    }

    getJournalById = async (id: string) => {
        return await this.journalRepository.findJournalById(id);
    }
}