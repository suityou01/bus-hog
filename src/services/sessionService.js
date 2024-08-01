import singletons from "../singletons.js";
import pkg from 'json-cycle';
const { decycle } = pkg;

class SessionService {
    static async getSessions () {
        return decycle(singletons.sessions);
    }
    static async addSession (session) {
        singletons.sessions.push(session);
    }
}
export default SessionService;