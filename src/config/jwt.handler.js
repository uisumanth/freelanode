var jwt = require("jsonwebtoken");
var config = require("./auth.config");
async function createToken (data,cb) {
  let token =  jwt.sign(data, config.secretKey, {
    expiresIn: "1d",
  });
  cb(token);
};
verifyToken = (token, cb) => {
  jwt.verify(token, config.secretKey,function(err,data){
        cb(data);
  });
};

module.exports = {
  createToken: createToken,
  verifyToken: verifyToken,
};
