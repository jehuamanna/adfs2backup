const fs = require('fs');
const yaml = require('yaml');
const swaggerUi = require('swagger-ui-express');
const docsRouter = require('express').Router();

// Add API documentation endpoint
const apispecPath = __dirname + '/api-spec.yaml';
const file = fs.readFileSync(apispecPath, 'utf-8');
const document = yaml.parse(file);

// Dynamically updating Swagger documentation using package.json file.
const { version: serviceVersion, description } = require('../../package.json');
document.info.version = serviceVersion;
document.info.description = description;

docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(document));

module.exports = docsRouter;
