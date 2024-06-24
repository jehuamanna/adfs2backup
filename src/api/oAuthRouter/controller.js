const logger = require('utils/logger');
const ExpressError = require('utils/expressError');
const {passport} = require('../../middlewares/passport');


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
    res.redirect(`/dashboard?token=${req.user}`);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error)
    new ExpressError();
  }
};

const dashboard = (req, res, next) => {
  try {
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
    return res.sendStatus(200);
  } catch (error) {
    console.log(error)

    next(new ExpressError());
  }
};
module.exports = {
  oAuthAuth,
  dashboard,
};
