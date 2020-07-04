module.exports.getAuthEndpoint = (domainProtocol, domainAddress, tokenLogin, tokenPass) => {
  return {
    method: 'GET',
    uri: domainProtocol + tokenLogin + ':' + tokenPass + '@' + domainAddress + '/auth/oauth/token',
    qs: { grant_type: 'client_credentials' },
    json: true
  }
}
