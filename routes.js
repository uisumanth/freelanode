var UserRoutes = require("./src/users/userRoutes");
var ProjectRoutes = require("./src/projects/projectRoutes");
var validateJwt = require("./src/config/jwt.handler");
var allRoutes = [...UserRoutes, ...ProjectRoutes];
var basePath = "/v1";

function GenerateRoutes(app) {
  allRoutes.map((row) => {
    app[row.method](basePath + row.path, function (req, res) {
      row.guard = false;
      if (row.guard) {
        validateJwt.verifyToken(req.headers.authorization, (data) => {
            // console.log(data)
            if(data){
                row.callback(req, res, data);
            }else{
                res.json({status:false,message:'Session Expired'})
            }
        });
      } else {
        row.callback(req, res);
      }
    });
  });
}

module.exports = GenerateRoutes;
