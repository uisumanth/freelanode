var jwt = require("jsonwebtoken");
var config = require("./auth.config");
async function createToken (data,cb) {
    console.log('IN')
  let token =  jwt.sign(data, config.secretKey, {
    expiresIn: "1d",
  });
  cb(token);
};
verifyToken = (token, cb) => {
    console.log("token",token)
  jwt.verify(token, config.secretKey,function(err,data){
      console.log(data)
        cb(data);
  });
};

module.exports = {
  createToken: createToken,
  verifyToken: verifyToken,
};
