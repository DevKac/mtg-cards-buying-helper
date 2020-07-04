module.exports.getOffersEndpoint = (domainProtocol, domainAddress, accessToken) => {
  return {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Accept': 'application/vnd.allegro.public.v1+json'
    },
    method: 'GET',
    uri: domainProtocol + domainAddress + '/offers/listing',
    qs: { phrase: 'Niv-Mizzet' },
    json: true
  }
}
