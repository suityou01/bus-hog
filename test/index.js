import{ ServiceBusClient } from "@azure/service-bus";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const topicName = "MYTOPIC";
const subscriptionName = "MYSUBSCRIPTION";

const sbClient = new ServiceBusClient(`Endpoint=sb://localhost/;SharedAccessKeyName=charlie;SharedAccessKey=password`);
const receiver = sbClient.createReceiver(topicName, subscriptionName);

const myMessageHandler = async (messageReceived) => {
    console.log(`Received message: ${messageReceived.body}`);
};

const myErrorHandler = async (error) => {
    console.log(error);
};

receiver.subscribe({
    processMessage: myMessageHandler,
    processError: myErrorHandler
});