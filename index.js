'use strict';

// N.B. Encoding problems are being caused by jsonwebtoken
// https://github.com/auth0/node-jsonwebtoken/pull/59

var app = require('express')(),
    cookieParser = require('cookie-parser'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    fs = require('fs');

var https = require('https');
console.warn('Not verifying HTTPS certificates');
https.globalAgent.options.rejectUnauthorized = false;

var adfsSigningPublicKey = fs.readFileSync('oneaccess.cer'); // Exported from ADFS
function validateAccessToken(accessToken) {
    var payload = null;
    console.log(adfsSigningPublicKey);
    try {
        console.log(accessToken)
        console.log(adfsSigningPublicKey)
        payload = jwt.verify(accessToken, adfsSigningPublicKey);
    }
    catch(e) {
        console.warn('Dropping unverified accessToken', e);
    }
    return payload;
}

// Configure passport to integrate with ADFS
var strategy = new OAuth2Strategy({
        authorizationURL: 'https://oneaccess.dtdc.com/adfs/oauth2/authorize',
        tokenURL: 'https://oneaccess.dtdc.com/adfs/oauth2/token',
        clientID: '7ca0da5c-7bef-4fb0-b37d-7e876ced4597', // This is just a UID I generated and registered
        clientSecret: 'ehaWTVjh__PyE3nyARLrNS3UnbFimPks2qU-_yY8', // This is ignored but required by the OAuth2Strategy
        //callbackURL: 'http://localhost:3000/callback'
        callbackURL: 'https://frplus-dev.dtdc.com/auth'
    },
    function(accessToken, refreshToken, profile, done) {
        if (refreshToken) {
            console.log('Received but ignoring refreshToken (truncated)', refreshToken.substr(0, 25));
        } else {
            console.log('No refreshToken received');
        }
        done(null, profile);
    });
strategy.authorizationParams = function(options) {
  return {
    //    resource: 'urn:relying:party:trust:identifier' // An identifier corresponding to the RPT
    response_type: "code",
    response_mode: "query",
    scope: "openid"
    
  };
};
strategy.userProfile = function(accessToken, done) {
    done(null, accessToken);
};
passport.use('oauth2', strategy);
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Configure express app
app.use(cookieParser());
app.use(passport.initialize());
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));
app.get('/login', passport.authenticate('oauth2'));
app.get('/callback', passport.authenticate('auth2'), function(req, res) {
    // Beware XSRF...
    res.cookie('accessToken', req.user);
    res.redirect('/');
});
app.get('/', function (req, res) {
    req.user = validateAccessToken(req.cookies['accessToken']);
    console.log(req.user)

    res.send(
        !req.user ? '<a href="/login">Log In</a>' : '<a href="/logout">Log Out</a>' +
        '<pre>' + JSON.stringify(req.user, null, 2) + '</pre>');
});
app.get('/logout', function (req, res) {
    res.clearCookie('accessToken');
    res.redirect('/');
});

app.listen(3000);
//app.listen(443);
console.log('Express server started on port 3000');
