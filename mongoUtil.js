const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://dbFreela:Newpass2@@cluster0.s8dda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var _db;

module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true }, function( err, client ) {
      _db  = client.db('freela');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};