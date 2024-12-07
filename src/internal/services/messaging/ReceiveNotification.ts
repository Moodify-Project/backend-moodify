import { Response } from "express";
import { AuthenticatedRequest } from "../../../../types/interfaces/interface.common";
import pubSubConfig from "../../configs/pubsub";
import { v1 } from "@google-cloud/pubsub";

export class ReceiveNotification {
    consumer = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
        try {
            const topicName = process.env.PUBSUB_TOPIC_NAME || "journal-notification";
            const projectId = process.env.PROJECT_ID || "tes-moodify";
            const pubsub = pubSubConfig(projectId);
            const subClient = new v1.SubscriberClient();

            const sanitizedEmail = req.email?.replace(/@/g, "-at-").replace(/\./g, "-dot-");
            const subscriptionName = `projects/${projectId}/subscriptions/user-${sanitizedEmail}-subscription`;

            const [subscriptions] = await pubsub.getSubscriptions();
            const subscriptionExists = subscriptions.some(sub => sub.name === subscriptionName);

            if (!subscriptionExists) {
                return res.status(404).json({
                    error: true,
                    message: `Subscription ${subscriptionName} does not exist.`,
                    reason: "Wait for user to already register for 1 day",
                });
            }

            const [response] = await subClient.pull({
                subscription: subscriptionName,
                maxMessages: 1,
            });

            if (response.receivedMessages?.length) {
                const promises = response.receivedMessages.map(async (message) => {
                    const parsedMessage = JSON.parse(message.message?.data?.toString() || "");

                    const emails = parsedMessage.result || [];
                    const selectedEmail = emails.find((email: any) => email.email === req.email);

                    if (selectedEmail && message.ackId) {
                        console.log("Selected Email:", selectedEmail);

                        await subClient.acknowledge({
                            subscription: subscriptionName,
                            ackIds: [message.ackId],
                        });

                        res.status(200).json({
                            error: false,
                            message: "Notification fetched successfully",
                            notification:
                                Number(selectedEmail.journal_count) === 0
                                    ? "Please create your journal"
                                    : "User already created journal",
                        });
                        return true;
                    }
                    return false;
                });

                const results = await Promise.all(promises);
                if (results.some((result) => result)) {
                    return;
                }
            }

            return res.status(404).json({
                error: true,
                message: "No matching notification found.",
            });
        } catch (error: any) {
            console.error("Error processing notifications:", error);
            return res.status(500).json({
                error: true,
                message: "An error occurred while processing notifications.",
            });
        }
    };
}
