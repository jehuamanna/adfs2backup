const oAuth = require('express').Router();
const OAuthController = require('./controller');
const { passport } = require('../../middlewares/passport');

oAuth.get('/login', passport.authenticate('oauth'));
oAuth.get('/auth', passport.authenticate('oauth'), OAuthController.oAuthAuth);
oAuth.get('/dashboard', OAuthController.oAuthDashboard);
oAuth.get('/script.js', OAuthController.oAuthScriptJs);
module.exports = oAuth;
