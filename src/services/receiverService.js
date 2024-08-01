import singletons from "../singletons.js";
import pkg from 'json-cycle';
const { decycle } = pkg;

class ReceiverService {
    static async getReceivers () {
        return decycle(singletons.receivers);
    }
    static async addReceiver (receiver) {
        singletons.receivers.push(receiver);
    }
    static async removeReceiver (receiver) {
        singletons.receivers = singletons.receivers.filter(r => r.name != receiver.name);
    }
}

export default ReceiverService;