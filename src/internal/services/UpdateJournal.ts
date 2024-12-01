import { Journal } from "../../domain/entities/Journal";
import { journalSchema } from "../../schemas/journalSchemas";
import { getTodayDateString } from "../../utils/todayString";
import validateData from "../../utils/validateData";
import { JournalRepository } from "../repositories/JournalRepository";

export class UpdateJournal {
    private journalRepository: JournalRepository;

    constructor(journalRepository: JournalRepository) {
        this.journalRepository = journalRepository;
    }

    execute = async (journalId: string, journal: Journal): Promise<void> => {
        const todayDateString = getTodayDateString();

        await this.journalRepository
        .findJournalById(journalId)
        .then((journal: Journal | null) => {
            if (!journal) throw new Error('no journal found');
          const journalDateFromDB: string = journal?.createdAt.toISOString();
          const dateString = journalDateFromDB.split("T")[0];
          if (dateString !== todayDateString) {
            throw new Error("The journal can't be edited after 24 hours have passed since its creation");
            // return res.status(400).json({
            //   success: false,
            //   message:
            //     "The journal can't be edited after 24 hours have passed since its creation",
            // });
          }
    
          return dateString;
        })
        .catch((error: any) => {
            console.log(error.message);
            throw new Error(error.message);
        });


        const successUpdatedJournal = await this.journalRepository.updateJournalById(
            journalId,
            journal
        );

        if (!successUpdatedJournal) {
            throw new Error('UnexpectedErrorOccurs');
        }
    }

    validateJournalRequest = (email: string, journal: Journal, journalId?: string): string | null => {
        const dataFix = {
            journalId,
            emailAuthor: email,
            content: journal.content,
        }

        const errorValidate = validateData(journalSchema, dataFix);
    
        if (errorValidate instanceof Map) {
            const errorResponseObj = Object.fromEntries(errorValidate);
            return JSON.stringify(errorResponseObj);
        }
    
        return null;
    };

    executeWithDate = async (email: string, journal: Journal, queryDate?: string): Promise<void> => {
        if (!queryDate) throw new Error('expected query of journal date');
    
        const todayDate = new Date(Date.now());
    
        const [year, month, date] = queryDate.split("-").map(Number);
        if (!year || !month || !date) throw new Error('Invalid queryDate format');
    
        const nextDate = new Date(year, month - 1, date + 1, 7, 59, 59);
        const previousDate = new Date(year, month - 1, date, 8, 0, 0);

        console.log(nextDate)
        console.log(previousDate)
    
        if (todayDate > nextDate || todayDate < previousDate) {
            throw new Error("can't update n-passed day after or before it's creation");
        }
    
        const journalSuccessfullyUpdated = await this.journalRepository.updateJournalByDate(email, journal, queryDate);
    
        if (!journalSuccessfullyUpdated) {
            throw new Error('UnexpectedErrorOccurs');
        }
    };

    executeToday = async (email: string, journal: Journal): Promise<void> => {
        const todayDateString = getTodayDateString();

        const journalSuccessfullyUpdated = await this.journalRepository.updateJournalByDate(email, journal, todayDateString);
    
        if (!journalSuccessfullyUpdated) {
            throw new Error('UnexpectedErrorOccurs');
        }
    }
    
}