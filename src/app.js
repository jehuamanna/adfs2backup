/* eslint-disable max-len */
/* eslint-disable no-console */
'use strict';

let translations = {};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (char) {
        return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

function atob(str) {
  return Buffer.from(str, 'base64').toString();
}

const authToken = {};

let token = '';

const app = require('express')(),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  fs = require('fs'),
  session = require('express-session');

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);

app.use(cors());

const https = require('https');
console.warn('Not verifying HTTPS certificates');
https.globalAgent.options.rejectUnauthorized = false;

// const adfsSigningPublicKey = Buffer.from(crtbase64, 'base64'); // Exported from ADFS
function validateAccessToken() {
  return null;
}

// Configure passport to integrate with ADFS
const strategy = new OAuth2Strategy(
  {
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
  function (accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken);
    // console.log("refreshToken", refreshToken);
    // console.log("profile", profile)
    token = accessToken;
    if (refreshToken) {
      // console.log('Received but ignoring refreshToken (truncated)', refreshToken.substr(0, 25));
    } else {
      console.log('No refreshToken received');
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
passport.use('oauth2', strategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Configure express app
app.use(cookieParser());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/login', passport.authenticate('oauth2'));
app.get('/auth', passport.authenticate('oauth2'), function (req, res) {
  // Beware XSRF...
  res.cookie('accessToken', req.user);
  console.log(req.user);
  const Empcode = parseJwt(token).Empcode;
  console.log(Empcode);
  console.log(req.user);
  authToken[Empcode] = token;
  res.redirect(`/dashboard?token=${req.user}`);
});

app.get('/getAuthToken/:empCode', (req, res) => {
  const empCode = req.params.empCode;
  let response = 'No Token Present';
  if (authToken[empCode]) {
    response = authToken[empCode];
  }
  res.send(response);
});

app.get('/dashboard', function (req, res) {
  const html_ = `
        <div id="output"> </div>
        <script>
        function sendTokenToParent(token) {
            /* window.opener.postMessage(token, window.location.origin); */
            /*window.opener.postMessage(token, "https://testingadfs-bhgjyz8fh-jehus-projects.vercel.app/"); */
            /* window.opener.postMessage(token, "https://dev-frplus.dtdc.com/"); */
            window.opener.postMessage(token, "http://localhost:1234");
            window.opener.postMessage(token, "https://frplus-uat.dtdc.com");
            window.opener.postMessage(token, "https://frplus-dev.dtdc.com");
            window.opener.postMessage(token, "https://dev-frplus.dtdc.com");
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
    `;
  res.send(html_);
});
app.get('/', function (req, res) {
  req.user = validateAccessToken(req.cookies['accessToken']);
  console.log(req.user);

  res.send(
    !req.user
      ? '<a href="/login">Log In</a>'
      : '<a href="/logout">Log Out</a>'
          + '<pre>'
          + JSON.stringify(req.user, null, 2)
          + '</pre>',
  );
});
app.get('/translations/:lang', async function (req, res) {
  const lang = req.params.lang;
  const translation = await fs.promises.readFile(
    `translation-${lang}.json`,
    'utf8',
  );
  console.log(translation);
  res.send(translation);
});
app.get('content/translations/:lang', async function (req, res) {
  const lang = req.params.lang;
  const translation = translations[lang];
  console.log(translation);
  res.send(translation);
});

app.get('/lang/:lang/version/:versionId', function (req, res) {
  const versionId = req.params.versionId;
  const lang = req.params.lang;
  const version = translations?.[lang]?.[versionId] || 0;

  res.send({ version });
});

// const languages = {};

app.post('/languages/', function (req, res) {
  console.log(req.body);
  translations = req.body;
  res.send('Success');
});

app.get('/languages/', function (req, res) {
  res.send(translations);
});

let translationsKeys = [];

app.post('/translationKeys', function (req, res) {
  console.log(req.body);
  translationsKeys = req.body.keys || [];
  res.send('Success');
});

app.get('/translationKeys', function (req, res) {
  res.send(translationsKeys);
});

module.exports = app;