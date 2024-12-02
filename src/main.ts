import express, { Request, Response } from 'express';
import { authMiddleware } from './middlewares/authMiddleware';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { mainRouter } from './routes/mainRoute';
import { PushJournalNotification } from './internal/services/messaging/PushJournalNotification';
import { ReceiveNotification } from './internal/services/messaging/ReceiveNotification';
import schedule from 'node-schedule';
import nation from './handlers/nation';
import { predictHandler } from './handlers/predictHandler';

// import createNewJournal, { editJournal, moodOnJournalEachDay } from './handlers/journalHandler';
// import uploadPhotoProfile from './handlers/UserInformationHandler';
// import loginHandler, { registerHandler } from './handlers/loginHandler';
// import { predictHandler } from './handlers/predictHandler';
// import { addArticleToBookmark, getAllArticle } from './handlers/articleHandler';
dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/api/v1', mainRouter);
app.post('/predict', predictHandler);

const pushNotification = new PushJournalNotification();

const pullNotification = new ReceiveNotification();

schedule.scheduleJob('* * * * *', () => {
    // pushNotification.producer();
});

// app.get('/users/journal', authMiddleware, pullNotification.consumer);


// TODO: store all routes in one file route.ts
// app.get('/news', getNews);
// app.get('/articles', getAllArticle);
// app.post('/login', loginHandler);
// app.post('/register', registerHandler);
app.get('/nations', nation);
// app.post('/journal', authMiddleware, createNewJournal);
// app.post('/bookmark', authMiddleware, addArticleToBookmark);
// app.post('/photo/upload', [authMiddleware, upload.single('image')], uploadPhotoProfile);
// app.put('/journal/:journalId', authMiddleware, editJournal);
// app.get('/journal_mood', authMiddleware, moodOnJournalEachDay);
// app.put('/journals/:journalId/predict', predictHandler)
app.get('/hello', authMiddleware, () => {
    console.log("hello word");
})

app.listen(port, '0.0.0.0', () => {
    console.log(`server run on http://0.0.0.0:${port}`);
});