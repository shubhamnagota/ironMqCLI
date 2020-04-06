const ironMq = require("iron_mq");
const axios = require("axios");
const config = require("../config");

const imq = new ironMq.Client({
	host: config.ironMq.host,
	project_id: config.ironMq.projectId,
	token: config.ironMq.token,
});

const addToQueue = (queueName, message) => {
	const queue = imq.queue(queueName);
	queue.post(message, (err, data) => {
		if (err) throw err;
		console.log("Added with message id : ", data);
	});
};

const clearQueue = (queueName) => {
	const queue = imq.queue(queueName);
	queue.clear();
	console.log("Cleaned");
};

const peekInQueue = (queueName) => {
	const queue = imq.queue(queueName);
	queue.peek({}, (err, data) => {
		console.log(data);
	});
};

const getInfoForQueue = (queueName) => {
	const queue = imq.queue(queueName);
	queue.info((err, data) => {
		console.log(data);
	});
};

const postThroughAPI = (queueName, message) => {
	const hostV = config.ironMq.apiHost;
	const projectId = config.ironMq.projectId;
	const url = `${hostV}/projects/${projectId}/queues/${queueName}/messages`;
	axios
		.post(
			url,
			{
				messages: [
					{
						body: message,
						delay: 0,
					},
				],
			},
			{
				headers: {
					Authorization: `OAuth ${config.ironMq.token}`,
				},
			},
		)
		.then(function(response) {
			console.log(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});
};

module.exports = { addToQueue, clearQueue, peekInQueue, getInfoForQueue, postThroughAPI };
