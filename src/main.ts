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

schedule.scheduleJob('* * * * *', () => {
    pushNotification.producer();
});

let job: schedule.Job | null = null;

app.post(
  '/api/v1/notifications',
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    if (!req.email) return res.status(401).send('No token provided');

    console.log('Preparing to execute cron job in 1 minute...');
    const action = Number(req.query.action) || null;

    try {
      if (action == 1) {
        console.log("executing pull notification");
        
        if (!job) {
          job = schedule.scheduleJob('* * * * *', async () => {
            try {
              await pullNotification.consumer(req, res, String(req.email));
            } catch (error) {
              console.error('Error in cron job execution:', error);
            }
          });
        }
      } else if (action == 0 || action == null) {

        console.log("try turn off cron")
        if (job) {
          console.log("deactivate cron");
          job.cancel();
          job = null;
          console.log('Cron job cancelled successfully');
        }
      }

      //res.status(200).send('Notification action executed successfully');
    } catch (error) {
      console.error('Error in /api/v1/notifications route:', error);
      //res.status(500).send('Internal Server Error');
    }
  }
);

app.get('/nations', nation);
app.get('/hello', authMiddleware, (req, res) => {
  console.log('Hello world');
  res.status(200).send('Hello world');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
