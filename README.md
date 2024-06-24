# Node Express Boilerplate

## How To Use  Boilerplate
Follow the below steps to use this base code.

* Clone the repo
* Update the package name in `package.json` and `package-lock.json`
* Update basePath in `server.js` and `src/apispec/api-spec.yaml`
* Update port number in `src/apispec/api-spec.yaml`
* Update default value of `idPrefix` in `src/app.js`
* Copy the env variables key name from `.env.template` and create a `.env` file with the values. This file overwrites most of the default values set in the previous steps.

## Folder Structure
All application source code is inside `src/` directory.
| Directory        | Description                                                                                                                                                    |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/api/`         | This directory contains all the api related files. Separate sub-directories for each sub path which contains the controller, business logic and service files  |
| `src/apispec/`     | This directory contains OpenAPI spec file `api-spec.yaml` where the api endpoints are defined.                                                                 |
| `src/constants/`   | This directory contains all the constants variable required for the service.                                                                                   |
| `src/db/`          | This is a placeholder directory where the DB related files should resign (eg: Model files, DB connection, etc...).                                             |
| `src/middlewares/` | Repository scoped middlewares are kept here. Create a common node module for project level middlewares.                                                        |
| `src/utils/`       | Repository scoped utilities. Currently, it contains `ExpressError` class and `Logger`.                                                                         |


### How to add a new endpoint.
Steps:
* Add the required API documentation in `src/apispec/api-spec.yaml`
* Create a folder inside `src/api/` with the sub path of the API
* Create a `routes.js` file for request routing and `controller.js` for handling the request. Business logic and service file to be created as per requirement
* Add unit tests for the newly created endpoints inside the `test/` directory
* Import the router in the `src/api/apiBaseRouter.js` and add appropriate route information.


## Local Paths
The boiler plate uses NPM Local Paths to make it easier to import common imports like middlewares, utils, etc... . This also eliminates the need for relative imports resulting in a much cleaner code. Read more about NPM Local Paths [here](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#local-paths).

Folders configured with local paths:
| Directory         | Import Name   |
|-------------------|---------------|
| `src/constants`   | `constants`   |
| `src/db`          | `db`          |
| `src/middlewares` | `middlewares` |
| `src/utils`       | `utils`       |

> Note: To add extra code in the local paths, add new files/functions to the existing files in the directories mentioned above.

```js
// Imports using relative import

const logger = require('../../../src/utils/logger');




// Imports using local paths

const logger = require('utils/logger');  // Use same to import inside deepely nested files.

```

## Error Codes
Error handling is done using ExpressError (`src/utils/expressError.js`) class and ErrorHandler (`src/middlewares/errorHandler.js`) middleware. ExpressError class depends on `src/constants/errorCodes.js` file for the error codes.

<br>

Example `errorCodes` config
```js
const errorCodes = {
    DEFAULT_ERROR: {
        statusCode: 561,
        errorCode: 'DEFAULT_ERROR',
        internalMessage: 'UninitiatedError',
        externalMessage: 'Something went wrong.'
    }
}
```
Error Code have four properties.
* statusCode: Response Status code that should be sent to the frontend.
* errorCode: Unique error code that will get logged.
* internalMessage: Detailed error description that will be logged. 
* externalMessage: Error message that will be sent in the api response. Do not include sensitive information here.

<br>

To create an error object, add a new error object inside the `errorCodes` config. Then crete a new ExpressError object using the error code.

```js
const ExpressError = require('utils/expressError');

function someFunction() {
    try{
        // ...
    } catch(err) {
        // ...

        throw new ExpressError('ERROR-CODE');
    }
}
```

`ExpressError` class can accept either an error code string or an object of the same class. The latter is useful if an error raised from one function to be raised to the upper level. 

```js
// File A

const ExpressError = require('utils/expressError');

const exampleFunc = () => {
    throw new ExpressError('ERROR-CODE');
};

module.exports = {
    exampleFunc,
};




// File B

const ExpressError = require('utils/expressError');
const { exampleFunc } = require('file A');

const executeFunc = () => {
    try {
        const result = exampleFunc();
    } catch (err) {
        throw new ExpressError(err); // Throws the same error thrown from `exampleFunc`.
    }
};

// ...
```

> Note: `ExpressError` will use the default error 'DEFAULT_ERROR' if the error code string is not found or a non ExpressError object is passed into the class.

## Request Error Handling Middleware
Errors are handled using a common error handling middleware `src/middlewares/errorHandler.js`. To raise an erorr, pass the error object to the `next()` method in the controller.

Example:
```js
// src/api/health-check/controller.js

const logger = require('utils/logger');
const ExpressError = require('utils/expressError');

const healthCheck = (req, res, next) => {
  try {

    logger.info('Called health-check endpoint');

    return res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    next(err);  // Thow api error using the `next()` method.
  }
};

module.exports = {
  healthCheck,
};
```

## Logging
Logging is done using winston and the log levels adhre to [RFC 3164](https://datatracker.ietf.org/doc/html/rfc3164) specifcation. The log levels and colors are set using `@niveus/winston-utils` [library](https://www.npmjs.com/package/@niveus/winston-utils). Refer the library documantion for more information on log levels and example codes.

Example Logging Implementation

```js
const logger = require('utils/logger');
const ExpressError = require('utils/expressError');

const executeFunc = () => {
    try {
        const result = someFunction();
    } catch (err) {
        logger.crit('Error message', err);  // To log a critical level error.

        throw err;
    };
};

// ...
```

### Cloud Logging
Cloud Logging is not added in the base code as the cloud provider may vary from project to project. To enable Cloud Logging on GCP, follow the [instructions](https://www.npmjs.com/package/@google-cloud/logging-winston) in the `@google-cloud/logging-winston` package.


## Context Logging Formatter for Winston.
The boilerplate contains a default winston formatter which uses `@niveus/express-context`. The same can be found inside the file `src/utils/logger.js` under the variable name `contextLogs`. 

Values like `reqid` (request id generated using `@niveus/express-reqid`) and `reqPath` (request url) are added to the context using both `@niveus/express-reqid` and an anonymous middleware in the `src/app.js` file. The same values are fetched within the `contextLogs` formatter and added along with every log by default. This makes it easy to filter out every logs generated for a particular request or a particular endpoint. More attributes can be added on top of this as per project requirements.

## Request ID tracing
The boilerplate comes with default request id tracing using `@niveus/express-reqid` package. Kindly read the [documentation](https://www.npmjs.com/package/@niveus/express-reqid) of `@niveus/express-reqid` to know how to configure request id tracing. The configurations can be changed in the `reqidOptions` variable inside `src/app.js` file.

## Express Context
Express Context is enabled using the package `@niveus/express-context`. It is useful to create request scoped context data that can be used to store data like session id, user id, etc... which are required in the further processing of the API request.

Kindly refer the `@niveus/express-context` [documentation](https://www.npmjs.com/package/@niveus/express-context) for detailed documentation and use cases.

## Git Hooks
Boilerplate comes with the basic pre-commit git hook which runs unit tests before the code can be committed. The hooks are implemented using [husky](https://www.npmjs.com/package/husky). Kindly add additional hooks if required.

