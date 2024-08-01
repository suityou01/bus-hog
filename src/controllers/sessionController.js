import SessionService from "../services/sessionService.js";

class SessionController {
    static async getSessions(req,res,next){
        res.json(
            await SessionService.getSessions()
        );
    }
}

export default SessionController;