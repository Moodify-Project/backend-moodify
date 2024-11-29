import { getTodayDateString } from "../../../utils/todayString";
import pubSubConfig from "../../configs/pubsub";
import { JournalRepository } from "../../repositories/JournalRepository";

export class PushJournalNotification {
    producer = async (email: string = "agung@gmail.com") => {
        const topicName = process.env.PUBSUB_TOPIC_NAME || 'journal-notification';
        const subscriptionName = process.env.PUBSUB_SUBCRIPTION_NAME || 'journal-subscription';
        const projectId = process.env.PROJECT_ID || 'tes-moodify';

        const pubsub = pubSubConfig(projectId);

        // Check if the topic exists, and create it if not
        const [topics] = await pubsub.getTopics();
        let topic = topics.find(t => t.name.endsWith(topicName));

        if (!topic) {
            [topic] = await pubsub.createTopic(topicName);
            console.log(`Topic ${topic.name} created.`);
        } else {
            topic = pubsub.topic(topicName);
        }

        // Check if the subscription exists, and create it if not
        const [subscriptions] = await pubsub.getSubscriptions();
        const subscriptionExists = subscriptions.some(sub => sub.name.endsWith(subscriptionName));

        if (!subscriptionExists) {
            await topic.createSubscription(subscriptionName);
            console.log(`Subscription ${subscriptionName} created.`);
        }

        const journalRepository = new JournalRepository();
        const todayString = getTodayDateString();

        // Retrieve emails for unwritten journals
        const emailUsers = await journalRepository.unwrittenJournalToday(todayString);

        console.log(emailUsers);

        const dataJournalingUser = emailUsers.map((result: any) => ({
            ...result,
            journal_count: Number(result.journal_count)
        }))

        const data = JSON.stringify({ result: dataJournalingUser });
        const dataBuffer = Buffer.from(data);

        // Publish the message
        try {
            const messageId = await topic.publishMessage({ data: dataBuffer });
            console.log(`Message published with ID: ${messageId}`);
        } catch (err) {
            console.error("Failed to publish message:", err);
        }
    };
}
