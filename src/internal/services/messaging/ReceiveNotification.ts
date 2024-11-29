import { Response } from "express";
import { AuthenticatedRequest } from "../../../../types/interfaces/interface.common";
import pubSubConfig from "../../configs/pubsub";
import { scheduleJob } from "node-schedule";

export class ReceiveNotification {
    consumer = async (req: AuthenticatedRequest, res: Response) => {
        const topicName = process.env.PUBSUB_TOPIC_NAME || "journal-notification";
        const subscriptionName = process.env.PUBSUB_SUBCRIPTION_NAME || "journal-subscription";
        const projectId = process.env.PROJECT_ID || "tes-moodify";

        const pubsub = pubSubConfig(projectId);
        const subscribe = pubsub.subscription(subscriptionName);

        const getMessageOrError = new Promise((resolve, reject) => {
            const messageHandler = (message: any) => {
                console.log(`Received message: ${message.data.toString()}`);
                message.ack();
                // subscribe.removeListener('message', messageHandler); // Stop listening
                // subscribe.removeListener('error', errorHandler); // Stop listening

                const parsedJson = JSON.parse(message.data.toString());
                const emails = parsedJson.result;

                console.log(emails);
                console.log(req.email);

                const selectedEmail = emails.find((result: any) => {
                    return result.email?.toLowerCase().trim() === req.email?.toLowerCase().trim()
                });

                console.log(selectedEmail);

                resolve(selectedEmail?.journal_count);

                
            }

            const errorHandler = (error: any) => {
                console.error('Pub/Sub error:', error);
                // subscribe.removeListener('message', messageHandler); // Stop listening
                // subscribe.removeListener('error', errorHandler); // Stop listening
                reject(error);
            };

            subscribe.on('message', messageHandler);
            subscribe.on('error', errorHandler);

            setTimeout(() => {
                subscribe.removeListener('message', messageHandler);
                subscribe.removeListener('error', errorHandler);
                reject(new Error("Timeout waiting for Pub/Sub message."));
            }, 5000);
        })

        // TODO: check again
        scheduleJob('2 * * * *', async () => {
            try {
                const messageData = await getMessageOrError;
    
                if (messageData === 0) {
                    res.status(200).json({
                        error: false,
                        message: "Please create your journal",
                    });
                } else {
                    res.status(404).json({
                        error: true,
                        message: 'No notification found, user already create journal',
                    });
                }
            } catch (error: any) {
                res.status(500).json({
                    error: false,
                    message: error.message,
                    reason: "Article only can fetched 1 time"
                });
            }
        })

    };
}
