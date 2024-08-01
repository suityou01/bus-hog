import NodeService from "../services/nodeService.js";

class NodeController {
    static async getNodes(req,res,next){
        res.json(
            await NodeService.getNodes()
        );
    }
    static async getNodeByTopic(req,res,next){
        const topic = req.params.topic;
        res.json(
            await NodeService.getNodeByTopic(topic)
        )
    }
}

export default NodeController;