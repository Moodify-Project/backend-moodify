import express from 'express';
import getNews from './handlers/getNews';
import loginHandler from './handlers/loginHandler';
import { authMiddleware } from './middlewares/authMiddleware';
import cookieParser from 'cookie-parser';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser());

app.get('/news', getNews);
app.post('/login', loginHandler);
app.get('/hello', authMiddleware, () => {
    console.log("hello word");
})

app.listen(port, () => {
    console.log(`server run on http://localhost:${port}`);
});