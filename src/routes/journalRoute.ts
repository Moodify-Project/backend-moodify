import { Router } from "express";
import { JournalRepository } from "../internal/repositories/JournalRepository";
import { FindDailyJournal } from "../internal/services/FindDailyJournal";
import { CreateNewJournal } from "../internal/services/CreateNewJournal";
import { JournalHandler, moodOnJournalEachDay } from "../handlers/journalHandler";
import { UpdateJournal } from "../internal/services/UpdateJournal";
import { MoodOnJournalServices } from "../internal/services/MoodOnJournal";
import { MoodOnJournalRepository } from "../internal/repositories/MoodOnJournalRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
import { WeeklyMoodJournal } from "../internal/services/WeeklyMoodJournal";

const journalRouter = Router();

const journalRepository = new JournalRepository();
const moodOnJournalRepository = new MoodOnJournalRepository();

const getJournalEachDay = new FindDailyJournal(journalRepository);
const createNew = new CreateNewJournal(journalRepository);
const updateJournal = new UpdateJournal(journalRepository);
const moodOnJournalService = new MoodOnJournalServices(journalRepository, moodOnJournalRepository);
const weeklyMoodJournal = new WeeklyMoodJournal(journalRepository, moodOnJournalRepository);

const journalHandler = new JournalHandler(createNew, getJournalEachDay, updateJournal, moodOnJournalService, weeklyMoodJournal);

// TODO: routing journal

journalRouter.post('/', authMiddleware, journalHandler.createNewToday);
journalRouter.get('/', authMiddleware, journalHandler.getJournalEachDay);
journalRouter.put('/', authMiddleware, journalHandler.updateJournalToday);
journalRouter.put('/today', authMiddleware, journalHandler.updateJournalTodayWithoutQueryParams);
journalRouter.put('/:id', authMiddleware, journalHandler.editJournal);
journalRouter.get('/moods', authMiddleware, moodOnJournalEachDay);
journalRouter.get('/moods/weekly', authMiddleware, journalHandler.fetchWeeklyMood);

export { journalRouter };
