import { getTodayDateString } from "../../../utils/todayString";
import pubSubConfig from "../../configs/pubsub";
import { JournalRepository } from "../../repositories/JournalRepository";

export interface UsersNotificationChecker {
    email: string;
    journal_count: number;
}

export class PushJournalNotification {
    producer = async () => {
        const topicName = process.env.PUBSUB_TOPIC_NAME || 'journal-notification';
        const subscriptionName = process.env.PUBSUB_SUBCRIPTION_NAME || 'journal-subscription';
        const projectId = process.env.PROJECT_ID || 'tes-moodify';

        const pubsub = pubSubConfig(projectId);

        const [topics] = await pubsub.getTopics();
        let topic = topics.find(t => t.name.endsWith(topicName));

        if (!topic) {
            [topic] = await pubsub.createTopic(topicName);
            console.log(`Topic ${topic.name} created.`);
        } else {
            topic = pubsub.topic(topicName);
        }

        // Check if the subscription exists, and create it if not

        //edit disini

        // const [subscriptions] = await pubsub.getSubscriptions();
        // const subscriptionExists = subscriptions.some(sub => sub.name.endsWith(subscriptionName));

        // if (!subscriptionExists) {
        //     await topic.createSubscription(subscriptionName);
        //     console.log(`Subscription ${subscriptionName} created.`);
        // }

        const journalRepository = new JournalRepository();
        const todayString = getTodayDateString();

        const emailUsers = await journalRepository.unwrittenJournalToday(todayString);

        console.log(emailUsers);

        //
        emailUsers.forEach(async (user: any) => {
            const sanitizedEmail = user.email?.replace(/@/g, "-at-").replace(/\./g, "-dot-");
            const userSubscriptionName = `user-${sanitizedEmail}-subscription`;

            const [subscriptions] = await pubsub.getSubscriptions();
            const subscriptionExists = subscriptions.some(sub => sub.name.endsWith(userSubscriptionName));
    
            if (!subscriptionExists) {
                await topic.createSubscription(userSubscriptionName);
                console.log(`Subscription ${userSubscriptionName} created.`);
            } else {
                console.log(`Subscription ${userSubscriptionName} already exists for user: ${user.email}`);
            }
    
        })

        const dataJournalingUser = emailUsers.map((result: UsersNotificationChecker) => ({
            ...result,
            journal_count: Number(result.journal_count)
        }))

        const data = JSON.stringify({ result: dataJournalingUser });
        const dataBuffer = Buffer.from(data);
        
        setTimeout(async () => {
            try {
                const messageId = await topic.publishMessage({ data: dataBuffer });
                console.log(`Message published with ID: ${messageId}`);
            } catch (err) {
                console.error("Failed to publish message:", err);
            }
        }, 20000)
    };
}
