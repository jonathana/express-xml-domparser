/**
 * Connect/Express compatible middleware for parsing raw xml body into DOM
 *
 * Based off the express-xml-bodyparser module at
 * https://github.com/macedigital/express-xml-bodyparser
 *
 * @license MIT
 */
'use strict';

var libxmljs = require("libxmljs"),
// inlined from connect's 'utils.js' file
  utils = {
    mime: function (req) {
      var str = req.headers['content-type'] || '';
      return str.split(';')[0];
    }
  };

module.exports = function (opts) {

  var options = opts || {
    async: true,
    explicitArray: true,
    normalize: true,
    normalizeTags: true,
    trim: true
  };

  return function xmldomparser(req, res, next) {

    var data = '';

    if (req._body) {
      return next();
    }

    if (!exports.regexp.test(utils.mime(req))) {
      return next();
    }

    req._body = true;

    req.setEncoding('utf-8');
    req.on('data', function (chunk) {
      data += chunk;
    });

    req.on('end', function () {
      var parsedDom;
      try {
        parsedDom = libxmljs.parseXml(data);
      }
      catch (err) {
        err.status = 400;
        return next(err);
      }
      req.xmlDom = parsedDom;
      req.rawBody = data;
      next();
    });

  };

};

exports.regexp = /^(text\/xml|application\/([\w!#\$%&\*`\-\.\^~]+\+)?xml)$/i;
