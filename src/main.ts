import express from 'express';
import getNews from './handlers/getNews';
import loginHandler from './handlers/loginHandler';
import { authMiddleware } from './middlewares/authMiddleware';
import cookieParser from 'cookie-parser';
import nation from './handlers/nation';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser());

app.get('/news', getNews);
app.post('/login', loginHandler);
app.get('/allNations', nation);
app.get('/hello', authMiddleware, () => {
    console.log("hello word");
})

app.listen(port, () => {
    console.log(`server run on http://localhost:${port}`);
});