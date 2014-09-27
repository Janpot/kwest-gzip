'use strict';

var Promise = require('bluebird'),
    gunzip  = Promise.promisify(require('zlib').gunzip);



function GzipError(message) {
  this.name = 'GzipError';
  this.message = message;
}
GzipError.prototype = new Error();
GzipError.prototype.constructor = GzipError;

function kwestGzip() {
  return function (request, next) {
    request.headers.set('accept-encoding', 'gzip');

    return next(request)
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
          .catch(function (err) {
            throw new GzipError(err.message);
          });
      });
  };
}

kwestGzip.GzipError = GzipError;
module.exports = kwestGzip;
