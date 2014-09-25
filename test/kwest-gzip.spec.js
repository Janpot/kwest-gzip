var kwestGzip = require('..'),
    Promise   = require('bluebird'),
    kwest     = require('kwest'),
    zlib      = require('zlib'),
    assert    = require('chai').assert;

describe('kwest-gzip', function () {

  it('no gzip', function (done) {

    var kwestMock = kwest.wrap(function (makeRequest, options) {
      assert.propertyVal(options.headers, 'accept-encoding', 'gzip');
      return Promise.resolve({
        body: 'hello',
        headers: {}
      });
    });

    var gzip = kwestGzip(kwestMock);
    gzip.get('http://www.example.com')
      .then(function (res) {
        assert.deepPropertyVal(res, 'body', 'hello');
        done();
      });

  });

  it('with gzip', function (done) {

    zlib.gzip(new Buffer('hello'), function (err, gzipped) {
      if (err) {
        return done(err);
      }

      var kwestMock = kwest.wrap(function (makeRequest, options) {
        assert.propertyVal(options.headers, 'accept-encoding', 'gzip');
        return Promise.resolve({
          body: gzipped,
          headers: {
            'content-encoding': 'gzip'
          }
        });
      });

      var gzip = kwestGzip(kwestMock);
      gzip.get('http://www.example.com')
        .then(function (res) {
          var body = String(res.body);
          assert.strictEqual(body, 'hello');
          done();
        });

    });

  });


});
