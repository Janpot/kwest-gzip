'use strict';

var Promise = require('bluebird'),
    zlib    = require('zlib'),
    gunzip  = Promise.promisify(zlib.gunzip);


function kwestGzip(request) {
  return request.wrap(function (makeRequest, options) {
    options.headers['accept-encoding'] = 'gzip';

    return makeRequest(options)
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
          })
          .catch(function () {
            return response;
          });
      });
  });
}

module.exports = kwestGzip;
