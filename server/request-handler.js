/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var _ = require('underscore');
var fs = require('fs'); // because we have to write on it
var dataBase = require('./data.json');
var indexPage;
fs.readFile('/Users/student/Desktop/2015-06-chatterbox-server/client/client/index.html', function(err, html) {
  if (err) {
    throw err;
  } else {
    indexPage = html;
  }
});
// using fs readFile, I'd set indexpage to the index html data

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  if (request.method === 'OPTIONS') {
    response.writeHead(200, defaultCorsHeaders);
    response.end();
  }
  // if request.url first 10 characters is '/static/''
  //take the remaining characters, add them to this path
  // read that file, and send that file in a response
  // ex: GET request, url is "/static/bower_components/jquery/jquery.min.js"
  // our handler sees "static", takes the rest of the message and calls it
  // var path.  Add path to our absolute path, so "/Users/.../"+path
  //fs readfile the new full path, save it to a variable, send it back as a
  // response
  if (request.method === 'POST') {
    response.writeHead(201, defaultCorsHeaders);
    var requestBody = '';

    request.on('data', function(data) {
      requestBody += data;
    })
    request.on('end', function() { // to wait for asynchronous processing
      dataBase['results'].push(JSON.parse(requestBody));
      if(__dirname.indexOf('server') !== -1) {
        fs.writeFile('./data.json', JSON.stringify(dataBase));
      } else {
        fs.writeFile('./server/data.json', JSON.stringify(dataBase));
      }
      response.end();
    })
  
  } else if (request.method === 'GET') {
  // The outgoing status.
    var headers = defaultCorsHeaders;

    if (request.url === '/classes/messages' || request.url === '/classes/room1') {
      headers['Content-Type'] = "application/JSON";
      response.writeHead(200, headers);
      response.end(JSON.stringify(dataBase));

    } else if (require.url = '/') {
      headers['Content-Type'] = "text/HTML";
      response.writeHead(200, headers);
      response.end(indexPage);

    } else {
      response.writeHead(404, headers);
      response.end('not found');
    }
  }
  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
// module.exports = {} (exports)
// module.exports = [Function request handler

// module.exports = {requestHandler: [Function requestHandler]}
exports.requestHandler = requestHandler;
