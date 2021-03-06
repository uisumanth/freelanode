var express = require('express');
var mongoUtil = require( './mongoUtil' );
var GenerateRoutes = require('./routes') 
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

GenerateRoutes(app);

app.listen(8080, function () {
  console.log('running on port:8080');
});


mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );