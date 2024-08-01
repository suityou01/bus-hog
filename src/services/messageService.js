import singletons from "../singletons.js";
import pkg from 'json-cycle';
const { decycle } = pkg;

class MessageService {
    static async getMessages () {
        return decycle(singletons.messages);
    }
    static async addMessage (message) {
        singletons.messages.push(message);
    }
}

export default MessageService;