import singletons from "../singletons.js";
import pkg from 'json-cycle';
const { decycle } = pkg;

class NodeService {
    static async getNodes () {
        return decycle(singletons.nodes);
    }
    static async addNode (node) {
        singletons.nodes.push(node);
    }
    static async getNodeByTopic (topic) {
        return singletons.nodes.filter(n => n.topic === topic);
    }
}

export default NodeService;