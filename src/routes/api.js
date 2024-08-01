import express from "express";
import SessionController from "../controllers/sessionController.js";
import ConnectionController from "../controllers/connectionController.js";
import MessageController from "../controllers/messageController.js";
import ReceiverController from "../controllers/receiverController.js";
import SenderController from "../controllers/senderController.js";
import TopicController from "../controllers/topicController.js";
import NodeController from "../controllers/nodeController.js";

const router = express.Router();

router.get("/sessions", await SessionController.getSessions);
router.get("/connections", await ConnectionController.getConnections);
router.get("/messages", await MessageController.getMessages);
router.get("/receivers", await ReceiverController.getReceivers);
router.get("/senders", await SenderController.getSenders);
router.get("/topics", await TopicController.getTopics);
router.get("/nodes", await NodeController.getNodes);
router.get("/nodes/:topic", await NodeController.getNodeByTopic);

router.post("/topics/:topic", TopicController.postToTopic)

export default router;