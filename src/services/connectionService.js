import singletons from "../singletons.js";
import pkg from 'json-cycle';
const { decycle } = pkg;

class ConnectionService {
    static async getConnections () {
        return decycle(singletons.connections);
    }
    static async addConnection (connection) {
        singletons.connections.push(connection);
    }
}

export default ConnectionService;