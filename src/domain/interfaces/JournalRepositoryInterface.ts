import { Journal } from "../entities/Journal";

export interface JournalRepositoryInterface {
  findOneJournal(email: string, equalDate: string): Promise<Journal>;
  createNew(journal: Journal): Promise<Journal>;
  findJournalById(journalId: string): Promise<Journal | null>;
  updateJournalById(journalId: string, journal: Journal): Promise<Journal>;
  journalIsPredicted(journalId: string): Promise<Journal>;
}
