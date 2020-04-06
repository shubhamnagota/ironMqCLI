const inquirer = require("inquirer");
const { isEmpty } = require("lodash");
const config = require("../config");
const queueUtils = require("./queueUtils");

const getEnvPromptAndGetQueueList = async () => {
	const envs = [ "local", "dev", "staging", "prod" ];

	const question = {
		type: "rawlist",
		name: "environment",
		message: "Select the env for queues : ",
		choices: envs,
		default: envs[0],
	};

	const { environment } = await inquirer.prompt([ question ]);
	return { queueList: Object.values(config[`${environment}Queues`]), environment };
};

const getQueueNamePrompt = async (queuesList) => {
	const questions = {
		type: "rawlist",
		name: "queueName",
		message: "Select the queue name : ",
		choices: queuesList,
		default: queuesList[0],
	};

	const { queueName } = await inquirer.prompt([ questions ]);
	return queueName;
};

const getQueueOperationPrompt = async (environment) => {
	const operations = [ "ADD", "PEEK", "INFO" ];
	if (environment === "local") operations.splice(1, 0, "CLEAR");

	const questions = {
		type: "rawlist",
		name: "operation",
		message: "Select the operation : ",
		choices: operations,
		default: operations[0],
	};

	const { operation } = await inquirer.prompt([ questions ]);
	return operation;
};

const getMessage = async () => {
	const questions = {
		type: "input",
		name: "message",
		message: "Enter the message : ",
	};

	let { message } = await inquirer.prompt([ questions ]);
	if (isEmpty(message)) {
		console.log("Message can't be empty.");
		message = await getMessage();
	}
	return message;
};

const performOperationOnQueue = async (operation, queueName) => {
	switch (operation) {
		case "ADD":
			const message = await getMessage();
			queueUtils.addToQueue(queueName, message);
			break;
		case "CLEAR":
			queueUtils.clearQueue(queueName);
			break;
		case "PEEK":
			queueUtils.peekInQueue(queueName);
			break;
		case "INFO":
			queueUtils.getInfoForQueue(queueName);
			break;
		default:
			break;
	}
};

module.exports = { getEnvPromptAndGetQueueList, getQueueNamePrompt, getQueueOperationPrompt, performOperationOnQueue };
