'use strict';

var Promise = require('bluebird'),
    gunzip  = Promise.promisify(require('zlib').gunzip);


function kwestGzip(kwest) {
  return kwest.wrap(function (makeRequest, request) {
    request.headers['accept-encoding'] = 'gzip';

    return makeRequest(request)
      .then(function (response) {
        var contentEnc = response.headers['content-encoding'];
        contentEnc = contentEnc && contentEnc.trim().toLowerCase();
            
        if (contentEnc !== 'gzip') {
          return response;
        }

        return gunzip(new Buffer(response.body, 'binary'))
          .then(function (unzipped) {
            response.body = unzipped;
            return response;
          });
      });
  });
}

module.exports = kwestGzip;
