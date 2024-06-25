const oAuth = require('express').Router();
const OAuthController = require('./controller');
const { passport } = require('../../middlewares/passport');


oAuth.get('/', OAuthController.oAuthHome)
oAuth.get('/login', passport.authenticate('oauth2'));
oAuth.get('/auth', passport.authenticate('oauth2'), OAuthController.oAuthAuth);
oAuth.get('/dashboard', OAuthController.oAuthDashboard);
module.exports = oAuth;
