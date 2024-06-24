const logger = require('utils/logger');
const ExpressError = require('utils/expressError');
const { passport } = require('../../middlewares/passport');


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

const oAuthAuth = (req, res) => {
  try {
    logger.info('Called health-check endpoint');
    res.cookie('accessToken', req.user);
    // console.log(req.user);
    const token = req.user;
    const Empcode = parseJwt(token).Empcode;
    // eslint-disable-next-line no-console
    console.log(Empcode);
    // console.log(req.user);
    // authToken[Empcode] = token;



    // SEND THE TOKEN TO THE SERVER


    // fetch('https://frplusnextgen.dtdc.com/apiuat/api/FrplusLoginAuths/getTokenkey', {
    //   body: {
    //     "empCode": Empcode,
    //     "applicationName": "frplus_app",
    //     "deviceName": "Laptop5",
    //     "tokenKey": token
    //   },
    //   method: "POST",
    //   headers: {
    //     'AuthToken': 'ac06f6806f86f96f5807b2606d194923',
    //     'Content-Type': 'application/json'
    //   }
    // }).then((r) => {
    //   console.log("Success")
    //   console.log(r)
    // }).catch((e) => {
    //   console.log(e)
    // });


    return res.redirect("/dashboard?token="+token);
  } catch (error) {
    console.log(error)
    new ExpressError();
  }
};

const oAuthScriptJs = (req, res) => {
  try {
    logger.info('Called health-check endpoint');
    // SEND THE TOKEN TO THE CLIENT

    const script = `
    
    function sendTokenToParent(token) {
      /* window.opener.postMessage(token, window.location.origin); */
      /*window.opener.postMessage(token, "https://testingadfs-bhgjyz8fh-jehus-projects.vercel.app/"); */
      /* window.opener.postMessage(token, "https://dev-frplus.dtdc.com/"); */
      window.opener.postMessage(token, "http://localhost:1234");
      window.opener.postMessage(token, "https://frplus-uat.dtdc.com" );
      window.opener.postMessage(token, "https://frplus-dev.dtdc.com");
      window.opener.postMessage(token, "https://dev-frplus.dtdc.com");
      window.close();
      console.log(token);
    };`

    return res.send(script);
  } catch (error) {
    console.log(error)
    new ExpressError();
  }
};


const oAuthDashboard = (req, res) => {
  try {
    logger.info('Called health-check endpoint');
    // SEND THE TOKEN TO THE CLIENT

    const html_ = `
    <html>
      <head>
      
      <script src="/script.js"  >
      </head>
      <body>
    </script>
    </body>
    </html>
    `;

    return res.send(html_);
  } catch (error) {
    console.log(error)
    new ExpressError();
  }
};

module.exports = {
  oAuthAuth,
  oAuthDashboard,
  oAuthScriptJs,
};
