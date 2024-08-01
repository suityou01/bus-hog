import { v4 as uuidv4 } from "uuid";
import SenderService from "./services/senderService.js";
import MessageService from "./services/messageService.js";

class CBSNode {
    subscription;
    host;
    enndpoint;
    token;
    message_id;
    remote_sender_address;
    local_sender;
    constructor(context){
        const address = context.message.application_properties.name;
        const urlSegments = address.match(/(?<!\?.\+)(?<=\/)[\w-]+(?=[\/\r\n?]|$)/gm);
        this.host = urlSegments[0];
        this.endpoint = address;
        this.topic = urlSegments[1];
        this.subscription = urlSegments[3];
        this.token = context.message.body;
        this.message_id = context.message.message_id;
        this.remote_sender_address = context.message.reply_to;
    }
    async negotiate(){
        [this.local_sender] = await SenderService.getSenderByToAddress(this.remote_sender_address);
        const response = {
            message_id: uuidv4(),
            correlation_id: this.message_id,
            to: this.remote_sender,
            application_properties: {
                statusCode: 200
            }
        }
        this.local_sender.send(response);
        MessageService.addMessage(response);
    }
}

export default CBSNode;