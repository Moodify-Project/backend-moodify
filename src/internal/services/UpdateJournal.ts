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

        validateData(journalSchema, journal); // TODO

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
}