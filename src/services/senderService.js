import singletons from "../singletons.js";
import pkg from 'json-cycle';
const { decycle } = pkg;

class SenderService {
    static async getSenders () {
        return singletons.senders.map(sender => {
            return {
                name: sender.name,
                session: {
                    links: Object.keys(sender.session.links)
                },
                state: sender.state
            }
        })
    }
    static async getSendersRaw () {
        return decycle(singletons.senders);
    }
    static async getSenderByToAddress (toAddress) {
        return singletons.senders.filter(s => s.name === toAddress);
    }
    static async getSenderByTopic (topic) {
        return singletons.senders.filter(s => s.name.startsWith(topic));
    }
    static async addSender (sender) {
        singletons.senders.push(sender);
    }
}

export default SenderService;