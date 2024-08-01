import singletons from "../singletons.js";
import { v4 as uuidv4 } from "uuid";
import pkg from 'json-cycle';
import NodeService from "./nodeService.js";
import SenderService from "./senderService.js";
import MessageService from "./messageService.js";

const { decycle } = pkg;

class TopicService {
    static async getTopics () {
        const nodes = await NodeService.getNodes()
        return nodes.map(n => { 
            return {
                topic: n.topic,
                subscription: n.subscription,
                endpoint: n.endpoint
            }
        });
    }
    static async addTopic (topic) {
        singletons.topics.push(topic);
    }
    static async postToTopic(topic, message){
        const topicSenders = await SenderService.getSenderByTopic(topic);
        console.log(message);
        message = {...message, ...{
            correlation_id: uuidv4()
        }};
        topicSenders.forEach(topicSender => {
            message.to = topicSender.name;
            topicSender.send(message);
            MessageService.addMessage(message);
        }
    );
    }
}

export default TopicService;