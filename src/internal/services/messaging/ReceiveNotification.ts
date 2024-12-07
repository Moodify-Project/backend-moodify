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
            const [subscriptions] = await pubsub.getSubscriptions();

            const subClient = new v1.SubscriberClient();

            const sanitizedEmail = req.email?.replace(/@/g, "-at-").replace(/\./g, "-dot-");
            
            const subscriptionName = `projects/${projectId}/subscriptions/user-${sanitizedEmail}-subscription`;

            if (!subscriptions.find(sub => sub.name === subscriptionName)) {
                return res.status(404).json({
                    error: true,
                    message: `Subscription ${subscriptionName} does not exist.`,
                });
            }


                const [response] = await subClient.pull({
                    subscription: subscriptionName,
                    maxMessages: 1,
                });

                if (response.receivedMessages) {
                    for (const message of response.receivedMessages) {
                        const parsedMessage = JSON.parse(message.message?.data?.toString() || "");

                        const emails = parsedMessage.result;
                        console.log(emails);
                        
                        const selectedEmail = emails.find((result: any) =>
                            result.email?.toLowerCase().trim() === req.email?.toLowerCase().trim()
                        );

                        if (selectedEmail && message.ackId) {
                            console.log("Selected Email:", selectedEmail);

                            // Acknowledge the message
                            await subClient.acknowledge({
                                subscription: subscriptionName,
                                ackIds: [message.ackId],
                            });

                            // Send response and exit the loop
                            return res.status(200).json({
                                error: false,
                                message: "Notification fetched successfully",
                                journal_count:
                                    Number(selectedEmail.journal_count) === 0
                                        ? "Please create your journal"
                                        : "User already create journal",
                            });
                        }
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
