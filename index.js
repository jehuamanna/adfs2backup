'use strict';

// N.B. Encoding problems are being caused by jsonwebtoken
// https://github.com/auth0/node-jsonwebtoken/pull/59

const crtbase64 = `MIIC4DCCAcigAwIBAgIQOatG6IEZeqhBINbcxHNVJTANBgkqhkiG9w0BAQsFADAsMSowKAYDVQQDEyFBREZTIFNpZ25pbmcgLSBvbmVhY2Nlc3MuZHRkYy5jb20wHhcNMjMwNjEzMDcyNjU5WhcNNDgwNjA2MDcyNjU5WjAsMSowKAYDVQQDEyFBREZTIFNpZ25pbmcgLSBvbmVhY2Nlc3MuZHRkYy5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCmuyTcvIGnZr59zVtQt856FDaV0Rxgn61s8T4Ya1objqGEv9j3svpPeKbUePJypIdsjfHchJs06wioq3dEjSopVCuVLJrx/6KNfulOfO4bz7TAE1psMGnRMe1+504wKnd+bSRTQnSIW2CsHhBQWcXcNZOlSEtl7JHUa6jGByil7M7JkP3t+SRM7LJqz4vWcTH5b6REaGx06/VnqM/W79qSiSumC/eTSZJ5zoDfDJhaFUv6qr6z/Mx1m9H+aOynHmzXN/DCB441MYLmSVQS+tvq8bbSqikKnnW1J07N14Bo7hSqOIlZDYBjZI/G8+o3QYMjFchTa+yenUNTqA55cN/jAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAI3k76wcLwC9ZRU2O22bYpwgW8tD7VeTBckhmQPyqVryjIXegL8Whwdva4XdZyGFO69cH416pnpe9Ytq1fIeRCbUdUhZ7JGtN1DTyMuOlT4MlTlgDBm9S1w4ywK1CSMkZ14oGF1i5r9lDq65iOPhvFr9IItF2TKMfy4HfijG1YypkoB7WjsOodlvNfXoNSfJYa0XsA+lCtDDO9mtZyzn/cAB0Ph+4yVdIskU4XS46jGpRWlvuMbwebUq5p8vydmSAFZu7QExz3SA/7LZu5E9dwZBHG+Uyt3y3dExR/BCQCgkTOeqd0DKsS7xZNlAhkdNbbtKsZjMLS128YmdoStfSXY=`

const translations = {
    hi: {"Don't aim at success. The more you aim at it and make it a target, the more you are going to miss it. For success, like happiness, cannot be pursued; it must ensue, and it only does so as the unintended side effect of one's personal dedication to a cause greater than oneself or as the by-product of one's surrender to a person other than oneself. Happiness must happen, and the same holds for success: you have to let it happen by not caring about it. I want you to listen to what your conscience commands you to do and go on to carry it out to the best of your knowledge. Then you will live to see that in the long-run—in the long-run, I say!—success will follow you precisely because you had forgotten to think about it": "सफलता का लक्ष्य मत रखो. जितना अधिक आप इस पर लक्ष्य साधेंगे और इसे एक लक्ष्य बनाएंगे, उतना ही अधिक आप इससे चूकते जायेंगे। सफलता के लिए, खुशी की तरह, पीछा नहीं किया जा सकता; यह अवश्य ही घटित होना चाहिए, और ऐसा केवल स्वयं से बड़े किसी उद्देश्य के प्रति किसी व्यक्ति के व्यक्तिगत समर्पण के अनपेक्षित दुष्प्रभाव के रूप में या स्वयं के अलावा किसी अन्य व्यक्ति के प्रति समर्पण के उप-उत्पाद के रूप में होता है। ख़ुशी अवश्य घटित होनी चाहिए, और यही बात सफलता पर भी लागू होती है: आपको इसकी परवाह न करके इसे घटित होने देना होगा। मैं चाहता हूं कि आप सुनें कि आपका विवेक आपको क्या करने का आदेश देता है और अपनी सर्वोत्तम जानकारी के अनुसार उसे पूरा करें। तब आप यह देखने के लिए जीवित रहेंगे कि लंबे समय में - लंबे समय में, मैं कहता हूं! - सफलता आपका पीछा करेगी क्योंकि आप इसके बारे में सोचना भूल गए थे", "Hello World": "हैलो लोग", "Home": "हैलो लोग", '49f68a5c8493ec2c0bf489821c21fc3b':3},
    kn: {"Hello World": "ಹಲೋ ವರ್ಲ್ಡ್", "Home": "ಮನೆ", '8c7e6965b4169689a88b313bbe7450f9':1},
    ta: {"Hello World": "வணக்கம் உலகம்", "Home": "இல்லம்", fec8f2a3f2e808ccb17c4d278b4fa469:1},
    ma: {"Hello World": "नमस्कार जग", "Home": "मुख्यपृष्ठ", b74df323e3939b563635a2cba7a7afba:1},
    ml: {"Hello World": "ഹലോ വേൾഡ്", "Home": "വീട്", '9830e1f81f623b33106acc186b93374e': 1 },
    pa: {e529a9cea4a728eb9c5828b13b22844c: 1 },
    te: {'569ef72642be0fadd711d6a468d68ee1': 1 }
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

app.get("/lang/:lang/version/:versionId", function(req, res) {
    const versionId = req.params.versionId;
    const lang = req.params.lang;
    const version = translations?.[lang]?.[versionId] || 0

    res.send({version})
})

app.listen(3000);
//app.listen(443);
console.log('Express server started on port 3000');
