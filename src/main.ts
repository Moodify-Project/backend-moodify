import express from 'express';
import getNews from './handlers/getNews';
import loginHandler, { registerHandler } from './handlers/loginHandler';
import { authMiddleware } from './middlewares/authMiddleware';
import cookieParser from 'cookie-parser';
import nation from './handlers/nation';

import dotenv from 'dotenv';
import createNewJournal, { editJournal } from './handlers/journalHandler';
dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser());

app.get('/news', getNews);
app.post('/login', loginHandler);
app.post('/register', registerHandler);
app.get('/allNations', nation);
app.post('/journal', authMiddleware, createNewJournal);
app.post('/journal/{journalId}', authMiddleware, editJournal);
app.get('/hello', authMiddleware, () => {
    console.log("hello word");
})

app.listen(port, () => {
    console.log(`server run on http://localhost:${port}`);
});