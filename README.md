# express-xml-domparser

For those rare cases when you want to make a DOM out of incoming raw xml-body requests. This middleware works with any connect- or express-based nodejs application.

## Description

Admittedly, having to deal with XML data has become less common in recent years. Still,  there are services and APIs using this format. The middleware is based on the [xml-dom-bodyparser middleware] (https://github.com/macedigital/express-xml-bodyparser) as a blueprint.

There were several features that express-xml-bodyparser calls out and here is how express-xml-domparser deals with  them:

* REMOVED: custom configuration options how to deal with xml data, since it was almost all related to xml->json   conversion
* KEPT: Attempt to parse data only once, even if middleware is called multiple times.
* KEPT: Skip data parsing immediately if no req-body has been sent.
* KEPT: Accept any XML-based content-type, e.g. `application/rss+xml`
* KEPT: No dependency on coffeescript keeping dependencies to a minimum.


## Installation

Utilize [npm](http://npmjs.org/) by typing `npm install express-xml-domparser --save` in your projects root folder   and you are good to go.

## Dependencies

Uses the [libxmljs npm package](https://www.npmjs.org/package/libxmljs) as its XML parser.

## Usage

You can either use express-xml-domparser at application level, or for specific routes only.

Here is an example of an express application with default settings:

````
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    xmldomparser = require('express-xml-domparser');

// .. other middleware ...
app.use(express.json());
app.use(express.urlencoded());
app.use(xmldomparser());
// ... other middleware ...

app.post('/receive-xml', function(req, res, next) {

  // req.rawData contains the parsed xml
  // req.xmlDom contains the DOM

});

server.listen(1337);

````

If you wanted to use express-xml-bodyparser for specific routes only, you would do something like this:

````
app.post('/receive-xml', xmldomparser(), function(req, res, next) {
  // check req.body
});
````

## Extensions to the http.ClientRequest (req) Object

This middleware adds 2 properties to the request object:

* req.rawBody: contains the raw data read in from the request, without any processing done to it
* req.xmlDom: the libxmljs XML DOM Document returned by parsing the raw data read from the request

## Usage Warnings

As this is processing the data events 'on' and 'end', it may conflict with other middleware (connect.bodyParser for
example) that also process the same data events.  Be careful if you try to use 2 body parsers.  Also note that several
different connect/express middleware attempts to expose req.rawBody as well in an attempt to reproduce early express
behavior.
