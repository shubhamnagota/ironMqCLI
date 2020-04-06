const { merge } = require("lodash");
const environment = require("./environment");
const queues = require("./queues");

const config = merge(environment, queues);

module.exports = config;
