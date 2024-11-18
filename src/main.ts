import express, { Request, Response } from 'express';
import getNews from './handlers/getNews';
import loginHandler, { registerHandler } from './handlers/loginHandler';
import { authMiddleware } from './middlewares/authMiddleware';
import cookieParser from 'cookie-parser';
import nation from './handlers/nation';
import multer from 'multer';
import dotenv from 'dotenv';
import createNewJournal, { editJournal, moodOnJournalEachDay } from './handlers/journalHandler';
import uploadPhotoProfile from './handlers/uploadPhotoProfile';
import cors from 'cors';
import { predictHandler } from './handlers/predictHandler';
import { addArticleToBookmark, getAllArticle } from './handlers/articleHandler';
dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000'
}));

const storage = multer.memoryStorage();

const upload = multer({ storage });

app.get('/news', getNews);
app.get('/articles', getAllArticle);
app.post('/login', loginHandler);
app.post('/register', registerHandler);
app.get('/allNations', nation);
app.post('/journal', authMiddleware, createNewJournal);
app.post('/bookmark', authMiddleware, addArticleToBookmark);
app.post('/uploadPhoto', [authMiddleware, upload.single('image')], uploadPhotoProfile);
app.post('/journal/:journalId', authMiddleware, editJournal);
app.get('/journal_mood', authMiddleware, moodOnJournalEachDay);
app.put('/predict/:journalId', predictHandler)
app.get('/hello', authMiddleware, () => {
    console.log("hello word");
})

app.listen(port, '0.0.0.0', () => {
    console.log(`server run on http://0.0.0.0:${port}`);
});