const request = require('request');
const readMultipleFiles = require('read-multiple-files');
const config = require('./config/config.json');
const authEndpoint = require('./endpoints/auth.endpoint');
const offersEndpoint = require('./endpoints/offers.endpoint');
const ResultFromResponses = require('./models/result-from-response.model');
const ResultToCsv = require('./models/result-to-csv.model');

// console.log(process.env);

const isProd = false;
const domainProtocol = isProd ? config.prod.domainProtocol : config.dev.domainProtocol;
const domainAuthAddress = isProd ? config.prod.domainAuthAddress : config.dev.domainAuthAddress;
const domainAddress = isProd ? config.prod.domainAddress : config.dev.domainAddress;
const tokenLogin = isProd ? config.prod.tokenLogin : config.dev.tokenLogin;
const tokenPass = isProd ? config.prod.tokenPass : config.dev.tokenPass;

// request(
//   authEndpoint.getAuthEndpoint(domainProtocol, domainAuthAddress, tokenLogin, tokenPass), 
//   (err, res, body) => {
//     if (err) { return console.log(err); }

//     const accessToken = body.access_token;
//     if (!accessToken) {
//       console.log('accessToken is null');
//       return;
//     }

//     request(
//       offersEndpoint.getOffersEndpoint(domainProtocol, domainAddress, accessToken),
//       (err, res, body) => {
//         if (err) { return console.log(err); }

//         console.log(body.items.promoted.length + body.items.regular.length );

//         const data = JSON.stringify(body);
//         // write JSON string to a file
//         fs.writeFile('examples3.json', data, (err) => {
//             if (err) {
//                 throw err;
//             }
//             console.log("JSON data is saved.");
//         });
//       }
//     );
//   }
// );

const resultFromResponses = new ResultFromResponses();
// @INFO: to jest zaślepka na dane z allegro, nie chce podczas developa walić do allegro non stop a też nie chce mi się robić mock servera
readMultipleFiles(new Set([
  'examples.json',
  'examples2.json',
  'examples3.json'
])).subscribe({
  next(result) {
    resultFromResponses.parseNewResponse(result.path, JSON.parse(result.contents));
  },
  complete() {
    const resultToCsv = new ResultToCsv(resultFromResponses.sellers, resultFromResponses.results);
    resultToCsv.saveCsvFile('./test.csv');
  }
});
