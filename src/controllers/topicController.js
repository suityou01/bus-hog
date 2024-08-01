import TopicService from "../services/topicService.js";
import { v4 as uuidv4 } from "uuid";

class TopicController {
    static async getTopics(req,res,next){
        res.json(
            await TopicService.getTopics()
        );
    }
    static async postToTopic(req,res,next){
        const topic = req.params.topic;
        const message = req.body;
        console.log(message);
        message.message_id = uuidv4();
        res.json(
            await TopicService.postToTopic(topic, message)
        );
    }
}

export default TopicController;