const passport = require('passport');
const authorizationURL = process.env.AUTHORIZATION_URL;
const tokenURL = process.env.TOKEN_URL;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callbackURL = process.env.CALLBACK_URL;
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


const strategy = new OAuth2Strategy(
  {
    authorizationURL: authorizationURL,
    tokenURL: tokenURL,
    clientID: clientID, // This is just a UID I generated and registered
    clientSecret: clientSecret, // This is ignored but required by the OAuth2Strategy
    callbackURL: callbackURL,
    pkce: true,
    state: true,
    store: true,

    // callbackURL: 'https://frplus-dev.dtdc.com/auth'
  },
  function (accessToken, refreshToken, profile, done) {
    // console.log('accessToken', accessToken);
    // console.log("refreshToken", refreshToken);
    // console.log("profile", profile)
    // const token = accessToken;
    if (refreshToken) {
      // console.log('Received but ignoring refreshToken (truncated)', refreshToken.substr(0, 25));
    } else {
    //   console.log('No refreshToken received');
    }
    done(null, accessToken);
  },
);

strategy.authorizationParams = function () {
  return {
    //    resource: 'urn:relying:party:trust:identifier' // An identifier corresponding to the RPT
    response_type: 'code',
    response_mode: 'query',
    scope: 'openid',
  };
};
strategy.userProfile = function (accessToken, done) {
  done(null, accessToken);
};

module.exports = {
  strategy,
  passport,
};
