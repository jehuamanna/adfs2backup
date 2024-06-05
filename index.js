'use strict';

// N.B. Encoding problems are being caused by jsonwebtoken
// https://github.com/auth0/node-jsonwebtoken/pull/59

const crtbase64 = `MIIC4DCCAcigAwIBAgIQOatG6IEZeqhBINbcxHNVJTANBgkqhkiG9w0BAQsFADAsMSowKAYDVQQDEyFBREZTIFNpZ25pbmcgLSBvbmVhY2Nlc3MuZHRkYy5jb20wHhcNMjMwNjEzMDcyNjU5WhcNNDgwNjA2MDcyNjU5WjAsMSowKAYDVQQDEyFBREZTIFNpZ25pbmcgLSBvbmVhY2Nlc3MuZHRkYy5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCmuyTcvIGnZr59zVtQt856FDaV0Rxgn61s8T4Ya1objqGEv9j3svpPeKbUePJypIdsjfHchJs06wioq3dEjSopVCuVLJrx/6KNfulOfO4bz7TAE1psMGnRMe1+504wKnd+bSRTQnSIW2CsHhBQWcXcNZOlSEtl7JHUa6jGByil7M7JkP3t+SRM7LJqz4vWcTH5b6REaGx06/VnqM/W79qSiSumC/eTSZJ5zoDfDJhaFUv6qr6z/Mx1m9H+aOynHmzXN/DCB441MYLmSVQS+tvq8bbSqikKnnW1J07N14Bo7hSqOIlZDYBjZI/G8+o3QYMjFchTa+yenUNTqA55cN/jAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAI3k76wcLwC9ZRU2O22bYpwgW8tD7VeTBckhmQPyqVryjIXegL8Whwdva4XdZyGFO69cH416pnpe9Ytq1fIeRCbUdUhZ7JGtN1DTyMuOlT4MlTlgDBm9S1w4ywK1CSMkZ14oGF1i5r9lDq65iOPhvFr9IItF2TKMfy4HfijG1YypkoB7WjsOodlvNfXoNSfJYa0XsA+lCtDDO9mtZyzn/cAB0Ph+4yVdIskU4XS46jGpRWlvuMbwebUq5p8vydmSAFZu7QExz3SA/7LZu5E9dwZBHG+Uyt3y3dExR/BCQCgkTOeqd0DKsS7xZNlAhkdNbbtKsZjMLS128YmdoStfSXY=`

const translations = {
    en: {"welcome_message": "Hello World"},
    hi: {"welcome_message": "हैलो लोग"},
    kn: {"welcome_message": "ಹಲೋ ವರ್ಲ್ಡ್"}
}


var app = require('express')(),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    fs = require('fs'),
    session = require('express-session')


    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }
    }))

    app.use(cors())

var https = require('https');
console.warn('Not verifying HTTPS certificates');
https.globalAgent.options.rejectUnauthorized = false;

var adfsSigningPublicKey = Buffer.from(crtbase64, 'base64') // Exported from ADFS
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
        callbackURL: 'https://adfs2.vercel.app/auth',
        pkce: true,
        state: true,
        store: true,

        // callbackURL: 'https://frplus-dev.dtdc.com/auth'
        
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("accessToken", accessToken);
        // console.log("refreshToken", refreshToken);
        // console.log("profile", profile)
        if (refreshToken) {
            // console.log('Received but ignoring refreshToken (truncated)', refreshToken.substr(0, 25));
        } else {
            console.log('No refreshToken received');
        }
        done(null, accessToken);
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
app.get('/auth', passport.authenticate('oauth2'), function(req, res) {
    // Beware XSRF...
    res.cookie('accessToken', req.user);
    console.log(req.user)
    res.redirect(`/dashboard?token=${req.user}`);
});

app.get("/dashboard", function(req, res){
    const html_ = `
        <div id="output"> </div>
        <script>
        function sendTokenToParent(token) {
            /* window.opener.postMessage(token, window.location.origin); */
            /*window.opener.postMessage(token, "https://testingadfs-bhgjyz8fh-jehus-projects.vercel.app/"); */
            window.opener.postMessage(token, "https://dev-frplus.dtdc.com/");
            window.close();
            console.log(token);
        }

        const url = new URL(window.location.href);
    
        // Get the query parameters
        const params = new URLSearchParams(url.search);
    
        // Get specific parameters
        const param = params.get('token');
    
        // Send the token to the parent window
        sendTokenToParent(param);
        console.log(token);
    
        // Output the parameters
        document.getElementById('output').innerHTML = \`
          <p>Token: \${param}</p>
        \`;
        </script>
    `
    res.send(html_)
})
app.get('/', function (req, res) {
    req.user = validateAccessToken(req.cookies['accessToken']);
    console.log(req.user)

    res.send(
        !req.user ? '<a href="/login">Log In</a>' : '<a href="/logout">Log Out</a>' +
        '<pre>' + JSON.stringify(req.user, null, 2) + '</pre>');
});
app.get('/translations/:lang', async function (req, res) {
    const lang = req.params.lang
    const translation = await fs.promises.readFile(`translation-${lang}.json`, 'utf8');
    console.log(translation) 
    res.send(translation)
});
app.get('/content/translations/:lang', async function (req, res) {
    const lang = req.params.lang
    const translation = translations[lang]
    console.log(translation) 
    res.send(translation)
});

app.get('/logout',  function (req, res) {
    res.clearCookie('accessToken');
    // read translation from input file asynchronously
    
    res.send(translation);
});

app.listen(3000);
//app.listen(443);
console.log('Express server started on port 3000');
