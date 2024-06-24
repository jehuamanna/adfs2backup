const oAuth = require('express').Router();
const OAuthController = require('./controller');
const { passport } = require('../../middlewares/passport');

oAuth.get('/login', passport.authenticate('oauth2'));
oAuth.get('/auth', passport.authenticate('oauth'), OAuthController.oAuthAuth);
oAuth.get('/dashboard', OAuthController.dashboard);
module.exports = oAuth;
