const request = require('request-promise');
const fs = require('fs');
const config = require('./config/config.json');
const cardList = require('./config/card-list.json');
const authEndpoint = require('./endpoints/auth.endpoint');
const offersEndpoint = require('./endpoints/offers.endpoint');
const ResultFromResponses = require('./models/result-from-response.model');
const ResultToCsv = require('./models/result-to-csv.model');

// console.log(process.env);
const isProd = true;
const apiProtocol = isProd ? config.prod.apiProtocol : config.dev.apiProtocol;
const apiAuthAddress = isProd ? config.prod.apiAuthAddress : config.dev.apiAuthAddress;
const apiAddress = isProd ? config.prod.apiAddress : config.dev.apiAddress;
const domainProtocol = isProd ? config.prod.domainProtocol : config.dev.domainProtocol;
const domainAddress = isProd ? config.prod.domainAddress : config.dev.domainAddress;
const tokenLogin = isProd ? config.prod.tokenLogin : config.dev.tokenLogin;
const tokenPass = isProd ? config.prod.tokenPass : config.dev.tokenPass;

request(
  authEndpoint.getAuthEndpoint(apiProtocol, apiAuthAddress, tokenLogin, tokenPass), 
  (err, res, body) => {
    if (err) { return console.log(err); }

    const accessToken = body.access_token;
    if (!accessToken) {
      console.log('accessToken is null');
      return;
    }

    const resultFromResponses = new ResultFromResponses();
    const logDate = new Date().toISOString().slice(0,10);
    const requests = [];
    cardList.forEach(card => {
      requests.push(
        request(
          offersEndpoint.getOffersEndpoint(apiProtocol, apiAddress, accessToken, card),
          (err, res, body) => {
            if (err) { return console.log(err); }

            const data = JSON.stringify(body);
            // write JSON string to a log file
            fs.writeFile('logs/' + logDate + '-' + card + '.json', data, (err) => {
                if (err) { console.log(err); }
            });
            resultFromResponses.parseNewResponse(card, JSON.parse(data));
          }
        )
      );
    });

    Promise.all(requests).then((values) => {
      const resultToCsv = new ResultToCsv(resultFromResponses.sellers, resultFromResponses.results, domainProtocol, domainAddress);
      resultToCsv.saveCsvFile('./test.csv');
    });
  }
);
