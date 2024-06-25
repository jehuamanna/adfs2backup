const expressContext = require('@niveus/express-context');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { expressReqid } = require('@niveus/express-reqid');
const errorHandler = require('middlewares/errorHandler');
const apiSpecRouter = require('./apispec/routes');
const apiBaseRouter = require('./api/apiBaseRouter');
const oAuthRouter = require('./api/oAuthRouter/routes');
const baseURL = process.env.SERVICE_BASE_URL || '/api-service';
const {passport, strategy} = require('./middlewares/passport');
const session = require('express-session')
const bodyParser = require('body-parser');
const https = require('https');
const cookieParser = require('cookie-parser');
const app = express();
// app.disable('x-powered-by'); // Disable x-powered-by header in response.

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP
}));

app.use(cookieParser());

// CORS config
// const corsOptions = {
//   origin: 'https://example.com', // Replace with relevant domains.
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// Common Middlewares
app.use(cors());


console.warn('Not verifying HTTPS certificates');
https.globalAgent.options.rejectUnauthorized = false;

app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))


app.use(passport.initialize());

// API base OAuth URL
app.use(`/`, oAuthRouter);

// Error handler
app.use(errorHandler);

module.exports = app;
