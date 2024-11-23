import { PubSub } from "@google-cloud/pubsub";

const pubSubConfig = (projectId: string) => {

    return new PubSub({
        projectId: projectId,
        keyFile: process.env.PUBSUB_FILEPATH || 'D:/DEV_REACT/backend-moodify/credential-pubsub.json'
    })

}

export default pubSubConfig;