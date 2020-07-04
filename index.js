const request = require('request');
const config = require('./config/config.json');
const authEndpoint = require('./endpoints/auth.endpoint');
const offersEndpoint = require('./endpoints/offers.endpoint');

console.log(process.env);

const isProd = false;
const domainProtocol = isProd ? config.prod.domainProtocol : config.dev.domainProtocol;
const domainAuthAddress = isProd ? config.prod.domainAuthAddress : config.dev.domainAuthAddress;
const domainAddress = isProd ? config.prod.domainAddress : config.dev.domainAddress;
const tokenLogin = isProd ? config.prod.tokenLogin : config.dev.tokenLogin;
const tokenPass = isProd ? config.prod.tokenPass : config.dev.tokenPass;

return;
request(
  authEndpoint.getAuthEndpoint(domainProtocol, domainAuthAddress, tokenLogin, tokenPass), 
  (err, res, body) => {
    if (err) { return console.log(err); }

    const accessToken = body.access_token;
    if (!accessToken) {
      console.log('accessToken is null');
      return;
    }

    request(
      offersEndpoint.getOffersEndpoint(domainProtocol, domainAddress, accessToken),
      (err, res, body) => {
        if (err) { return console.log(err); }

        console.log(body.items.promoted.length + body.items.regular.length );
      }
    );
  }
);
