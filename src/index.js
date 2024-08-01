import express from "express";
import rhea from "rhea";
import url from "url";
import fs from "fs";
import path from "path";
import util from "util";
import logger from "./logging/logging.js";
import CBSNode from "./cbsNode.js";
import Routes from "./routes/index.js";
import singletons from "./singletons.js";
import ConnectionService from "./services/connectionService.js";
import ReceiverService from "./services/receiverService.js";
import NodeService from "./services/nodeService.js";
import SenderService from "./services/senderService.js";
import SessionService from "./services/sessionService.js";
import MessageService from "./services/messageService.js";
import TopicService from "./services/topicService.js";

const app = express();
const port = 3000;

app.set('views', path.join(process.cwd(), 'src/views'));
app.use(express.static(path.join(process.cwd(),'public')));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.render('pages/index', {
        receivers: await ReceiverService.getReceivers(),
        senders: await SenderService.getSenders(),
        sessions: singletons.sessions,
        connections: singletons.connections,
        containers: singletons.containers,
        tokens: singletons.tokens,
        messages: await MessageService.getMessages(),
        topics: await TopicService.getTopics()
    });
});
app.post('/', async (req, res) => {
    console.log(req.body);
    res.statusCode = 200;
    res.send({});
});

app.use(Routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

const container = rhea.create_container();

/* Receiver events */

container.on('receiver_open', function (context) {
    context.receiver.set_target({address:context.receiver.remote.attach.target.address});
    ReceiverService.addReceiver(context.receiver);
    logger.info(`receiver_open ${context.receiver.name}`);
});

container.on('receiver_drained', function (context) {
    logger.info(`receiver_drained ${context.receiver.name}`);
});

container.on('receiver_flow', function (context) {
    logger.info(`receiver_flow ${context.receiver.name}`);
});

container.on('receiver_error', function (context) {
    logger.info(`receiver_error ${context.receiver.name}`);
    logger.info(context);
});

container.on('receiver_close', function (context) {
    ReceiverService.removeReceiver(context);
    logger.info(`receiver_close ${context.receiver.name}`);
});

container.on('settled', function (context) {
    logger.info(`settled delivery.id: ${context.delivery.id} link: %${context.delivery.link.name}`);
});

container.on('message', function (context) {
    logger.info(`message ${context.message.message_id}`);
    fs.writeFileSync('message', util.inspect(context));
    const request = context.message;
    MessageService.addMessage(request);
    if(isCBSNegotiation(request)){
        const cbsNode = new CBSNode(context);
        cbsNode.negotiate();
        NodeService.addNode(cbsNode);
    }
});

/* End of Receiver events */

/* Sender events */

container.once('sendable', function (context) {
    logger.info(`sendable ${context.sender.name}`);
    singletons.containers.push(context.container);
});

container.on('sender_open', function (context) {
    logger.info(`sender_open ${context.sender.name}`);
    if (context.sender.source.dynamic) {
        const id = container.generate_uuid();
        context.sender.set_source({address:id});
    }
    SenderService.addSender(context.sender);
});

container.on('sender_close', function (context) {
    logger.info(`sender_close ${context.sender.name}`);
    SenderService.removeSender(context.sender.name);
});

container.on('sender_error', function (context) {
    logger.error(`sender_error ${context}`);
});

container.on('sender_draining', function (context) {
    logger.info(`sender_draining ${context.sender.name}`);
});

container.on('accepted', function (context) {
    logger.info(`accepted delivery.id: ${context.delivery.id} sender: ${context.delivery.link.name}`);
});

container.on('released', function (context) {
    logger.info(`released ${context}`);
});

container.on('rejected', function (context) {
    logger.error(`rejected ${context}`);
});

container.on('modified', function (context) {
    logger.info(`modified ${context}`);
});

container.on('sender_flow', function (context) {
    logger.info(`sender_flow ${context}`);
});

/* End of Sender events */

/* Session events */
container.on('session_open', function (context) {
    logger.info(`session_open local: ${context.session.connection.local.open.container_id} remote: ${context.session.connection.remote.open.container_id}`);
    SessionService.addSession(context);
});

container.on('session_error', function (context) {
    logger.info(`session_error ${context}`);
});

container.on('session_close', function (context) {
    logger.info(`session_close ${context}`);
});
/* End of Session events */

/* Connection events */
container.on('connection_open', function (context) {
    logger.info(`connection_open local: ${context.connection.local.open.container_id} remote: ${context.connection.remote.open.container_id}`);
    ConnectionService.addConnection(context);
});

container.on('connection_close', function (context) {
    logger.info(`connection_close ${context}`);
});

container.on('connection_error', function (context) {
    logger.error(`connection_error ${context}`);
});

container.on('protocol_error', function (context) {
    logger.info(`protocol_error ${context}`);
});

container.on('error', function (context) {
    logger.error(`error ${context}`);
});

container.on('disconnected', function (context) {
    logger.info(`disconnected ${context}`);
});

/* End of Connection events */

const isCBSNegotiation = (message) => {
    return message.to && 
        message.to === "$cbs" && 
        message.application_properties &&
        message.application_properties.operation &&
        message.application_properties.operation === "put-token";
}

const opts = {
    id: "bushog",
    max_frame_size: 512,
    host: "0.0.0.0",
    port: 5671,
    transport: "tls",
    // Certificate(s) & Key(s)
    cert: fs.readFileSync(path.join(process.cwd(), 'src/certs/server.crt')),
    key: fs.readFileSync(path.join(process.cwd(), 'src/certs/server.key')),
};

const server = container.listen(opts);

server.on('clientError', function (error, socket) {
    logger.error(`clientError ${error}`);
});

console.log("RECEIVE: Listening at " + url.format("0.0.0.0"));