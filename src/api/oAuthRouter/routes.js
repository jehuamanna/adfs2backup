const oAuth = require('express').Router();
const OAuthController = require('./controller');
const { passport } = require('../../middlewares/passport');

oAuth.get('/login', OAuthController.oAuthLogin);
oAuth.get('/auth', passport.authenticate('oauth'), OAuthController.oAuthAuth);
oAuth.get('/dashboard', OAuthController.dashboard);
module.exports = oAuth;
