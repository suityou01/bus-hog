import SenderService from "../services/senderService.js";

class SenderController {
    static async getSenders(req,res,next){
        res.json(
            await SenderService.getSenders()
        );
    }
}

export default SenderController;