import { getTodayDateString, getYesterdayDateString } from "../../../utils/todayString";
import pubSubConfig from "../../configs/pubsub";
import { JournalRepository } from "../../repositories/JournalRepository";

export interface UsersNotificationChecker {
    email: string;
    journal_count: number;
}

export class PushJournalNotification {
    producer = async () => {
        const topicName = process.env.PUBSUB_TOPIC_NAME || "journal-notification";
        const projectId = process.env.PROJECT_ID || "tes-moodify";

        const pubsub = pubSubConfig(projectId);

        const [topics] = await pubsub.getTopics();
        let topic = topics.find((t) => t.name.endsWith(topicName));

        if (!topic) {
            [topic] = await pubsub.createTopic(topicName);
            console.log(`Topic ${topic.name} created.`);
        } else {
            topic = pubsub.topic(topicName);
        }

        const journalRepository = new JournalRepository();
        const todayString = getTodayDateString();
        const yesterdayString = getYesterdayDateString();
        const emailUsers = await journalRepository.unwrittenJournalToday(todayString, yesterdayString);

        console.log(emailUsers);

        const subscriptionPromises = emailUsers.map(async (user: UsersNotificationChecker) => {
            const sanitizedEmail = user.email?.replace(/@/g, "-at-").replace(/\./g, "-dot-");
            const userSubscriptionName = `user-${sanitizedEmail}-subscription`;

            const [subscriptions] = await pubsub.getSubscriptions();
            const subscriptionExists = subscriptions.some((sub) => sub.name.endsWith(userSubscriptionName));

            if (!subscriptionExists) {
                await topic.createSubscription(userSubscriptionName);
                console.log(`Subscription ${userSubscriptionName} created.`);
            } else {
                console.log(`Subscription ${userSubscriptionName} already exists for user: ${user.email}`);
            }
        });

        await Promise.all(subscriptionPromises);

        const dataJournalingUser = emailUsers.map((result: UsersNotificationChecker) => ({
            ...result,
            journal_count: Number(result.journal_count),
        }));

        const data = JSON.stringify({ result: dataJournalingUser });
        const dataBuffer = Buffer.from(data);

        try {
            const messageId = await topic.publishMessage({ data: dataBuffer });
            console.log(`Message published with ID: ${messageId}`);
        } catch (err) {
            console.error("Failed to publish message:", err);
        }
    };
}
