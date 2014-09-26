# kwest-gzip [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

gzip plugin for the [kwest](https://github.com/Janpot/kwest) module

## Installation

    $ npm install --save kwest-gzip

## Use

enable gzip for kwest
```js
var kwestGzip = require('kwest-gzip'),
    kwest = require('kwest'),
    request = kwestGzip(kwest);

// requests with "accept-encoding: gzip" header
request('http://www.example.com/gzipped')
  .then(function (res) {
    // logs gunzipped body
    console.log(res.body);
  })
```


[travis-url]: http://travis-ci.org/Janpot/kwest-gzip
[travis-image]: http://img.shields.io/travis/Janpot/kwest-gzip.svg?style=flat

[depstat-url]: https://david-dm.org/Janpot/kwest-gzip
[depstat-image]: http://img.shields.io/david/Janpot/kwest-gzip.svg?style=flat
