import ReceiverService from "../services/receiverService.js";

class ReceiverController {
    static async getReceivers(req,res,next){
        res.json(
            await ReceiverService.getReceivers()
        );
    }
}

export default ReceiverController;