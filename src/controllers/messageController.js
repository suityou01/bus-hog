import MessageService from "../services/messageService.js";

class MessageController {
    static async getMessages(req,res,next){
        res.json(
            await MessageService.getMessages()
        );
    }
}

export default MessageController;