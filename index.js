var express = require('express');
var mongoUtil = require( './mongoUtil' );
var GenerateRoutes = require('./routes') 
var path=require('path');
var app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use("/v1/files", express.static(__dirname + '/public/uploads'));
GenerateRoutes(app);

app.listen(4444, function () {
  console.log('running on port:4444');
});


mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );