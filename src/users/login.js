var mongoUtil = require("../../mongoUtil");
var validateJwt = require("../config/jwt.handler");

var db;

async function LoginInsert (req, res) { console.log(req.body)
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { email: request.email, password: request.password };
  db.collection("users", function (err, collection) {
    collection.findOne(query, function (err, item) {
      if (!item) {
        res.json({ status: false, data: null, message: "User not Found" });
      } else {
        validateJwt.createToken(item,(token)=>{
          res.json({ status: true, data: {...item,accessToken:token} });
          })
      }
    });
  });
};

module.exports = LoginInsert;
