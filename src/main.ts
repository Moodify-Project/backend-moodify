import express from 'express';
import getNews from './handlers/getNews';
import loginHandler, { registerHandler } from './handlers/loginHandler';
import { authMiddleware } from './middlewares/authMiddleware';
import cookieParser from 'cookie-parser';
import nation from './handlers/nation';
import multer from 'multer';
import dotenv from 'dotenv';
import createNewJournal, { editJournal } from './handlers/journalHandler';
import uploadPhotoProfile from './handlers/uploadPhotoProfile';
dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();

const upload = multer({ storage });

app.get('/news', getNews);
app.post('/login', loginHandler);
app.post('/register', registerHandler);
app.get('/allNations', nation);
app.post('/journal', authMiddleware, createNewJournal);
app.post('/uploadPhoto', [authMiddleware, upload.single('image')], uploadPhotoProfile);
app.post('/journal/{journalId}', authMiddleware, editJournal);
app.get('/hello', authMiddleware, () => {
    console.log("hello word");
})

app.listen(port, () => {
    console.log(`server run on http://localhost:${port}`);
});