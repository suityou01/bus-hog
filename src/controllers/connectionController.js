import ConnectionService from "../services/connectionService.js";

class ConnectionController {
    static async getConnections(req,res,next){
        res.json(
            await ConnectionService.getConnections()
        );
    }
}

export default ConnectionController;