import { Journal } from "../../domain/entities/Journal";
import { journalSchema } from "../../schemas/journalSchemas";
import { getTodayClockString, getTodayDateString } from "../../utils/todayString";
import validateData from "../../utils/validateData";
import { JournalRepository } from "../repositories/JournalRepository";
import { v4 as uuidv4 } from 'uuid';

export class CreateNewJournal {
    private journalRepository: JournalRepository;

    constructor(journalRepository: JournalRepository) {
        this.journalRepository = journalRepository;
    }

    execute = async(email: string, content: string): Promise<boolean> => {
        // if (!content) {
        //     throw new Error('LackOfRequestBody')
        // }

        const utc = 8;

        const todayDate = getTodayDateString();
        const todayClock = getTodayClockString(utc);

        try {
            console.log(email);
            const existingJournal = await this.journalRepository.findOneJournal(email, todayDate);

            console.log(existingJournal);
            if (existingJournal) {
                console.log('true')
                return true;
            }

            console.log('false')

            return false;

        } catch (error) {
            const randomUUID = uuidv4();

            const journal = new Journal(email, randomUUID, content, false);
    
            const journalData = validateData(journalSchema, journal);
    
            if (journalData instanceof Map) {
              const errReponseObj = Object.fromEntries(journalData);
              throw new Error(JSON.stringify(errReponseObj));
            }
    
            const journalCreated = await this.journalRepository.createNew(journal);
    
            if (!journalCreated) {
                throw new Error('UnexpectedErrorCantCreateJournal')
              }
        }

        return false;
        
    }
}