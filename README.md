# Bus Hog

A very rough first attempt at a local Azure Service Bus Emulator. The application is build on express.js.
For more information on how the Azure Service Bus AQMP protocol works under the hood, please [read](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-amqp-protocol-guide)

The following routes are supported

- GET /sessions
- GET /connections
- GET /messages
- GET /receivers
- GET /senders
- GET /topics
- GET /nodes
- GET /nodes/:topic
- POST /topics/:topic

There is a postman collection in the postman_collection folder which can be [imported directly into postman](https://learning.postman.com/docs/designing-and-developing-your-api/importing-an-api/). 

## Run the server
Open a bash terminal and run the following command

```bash
npm run dev
```

## Run test client
Open another bash terminal and run the following command

```bash
npm run test
```
