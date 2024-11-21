import { Router } from "express";
import { JournalRepository } from "../internal/repositories/JournalRepository";
import { FindDailyJournal } from "../internal/services/FindDailyJournal";
import { CreateNewJournal } from "../internal/services/CreateNewJournal";
import { JournalHandler, moodOnJournalEachDay } from "../handlers/journalHandler";
import { UpdateJournal } from "../internal/services/UpdateJournal";
import { MoodOnJournalServices } from "../internal/services/MoodOnJournal";
import { MoodOnJournalRepository } from "../internal/repositories/MoodOnJournalRepository";
import { authMiddleware } from "../middlewares/authMiddleware";

const journalRouter = Router();

const journalRepository = new JournalRepository();
const moodOnJournalRepository = new MoodOnJournalRepository();

const getJournalEachDay = new FindDailyJournal(journalRepository);
const createNew = new CreateNewJournal(journalRepository);
const updateJournal = new UpdateJournal(journalRepository);
const moodOnJournalService = new MoodOnJournalServices(journalRepository, moodOnJournalRepository);

const journalHandler = new JournalHandler(createNew, getJournalEachDay, updateJournal, moodOnJournalService);

// TODO: routing journal

journalRouter.post('/', authMiddleware, journalHandler.createNewToday);
journalRouter.get('/', authMiddleware, journalHandler.getJournalEachDay);
journalRouter.put('/:id', authMiddleware, journalHandler.editJournal);
journalRouter.get('/moods', authMiddleware, moodOnJournalEachDay);

export { journalRouter };
