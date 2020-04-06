require("dotenv").config();

const utils = require("./utils");

(async () => {
	const {queueList, environment} = await utils.getEnvPromptAndGetQueueList();
	const queueName = await utils.getQueueNamePrompt(queueList);
	const operation = await utils.getQueueOperationPrompt(environment);
	await utils.performOperationOnQueue(operation, queueName);
})();
