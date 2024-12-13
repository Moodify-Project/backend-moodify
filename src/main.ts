import express, { Response } from 'express';
import { authMiddleware } from './middlewares/authMiddleware';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { mainRouter } from './routes/mainRoute';
import { PushJournalNotification } from './internal/services/messaging/PushJournalNotification';
import { ReceiveNotification } from './internal/services/messaging/ReceiveNotification';
import nation from './handlers/nation';
import { predictHandler } from './handlers/predictHandler';
import schedule from 'node-schedule';
import { AuthenticatedRequest } from '../types/interfaces/interface.common';

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

// app.post('/api/v1/notifications', authMiddleware, pullNotification.consumer);

let job: schedule.Job | null = null;

app.post(
  "/api/v1/notifications",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    if (!req.email) return res.send("no token");
    console.log("eksekusi cron dalam 1 menit")
    const action = Number(req.query.action) || null;

    if (action == 0) {
      if (!job) {
          job = schedule.scheduleJob("* * * * *", async () => {
            try {
              console.log("Executing pull notification cron job...");
              await pullNotification.consumer(req, res);
            } catch (error) {
              console.error("Error in cron job execution:", error);
            }
          });
      }
    }

    if (action == 1) {
      if (job) {
        job.cancel();
        job = null;
      }
    }
  }
);


app.get('/nations', nation);
app.get('/hello', authMiddleware, () => {
    console.log("hello word");
})

app.listen(port, '0.0.0.0', () => {
    console.log(server run on http://0.0.0.0:${port});
});
