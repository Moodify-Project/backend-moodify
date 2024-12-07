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

dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1', mainRouter);
app.post('/predict', predictHandler);

const pushNotification = new PushJournalNotification();

const pullNotification = new ReceiveNotification();

schedule.scheduleJob('*/2 * * * *', () => {
    pushNotification.producer();
});

app.get('/api/v1/notifications', authMiddleware, pullNotification.consumer);


app.get('/nations', nation);
app.get('/hello', authMiddleware, () => {
    console.log("hello word");
})

app.listen(port, '0.0.0.0', () => {
    console.log(`server run on http://0.0.0.0:${port}`);
});