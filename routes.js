var UserRoutes = require("./src/users/userRoutes");
var ProjectRoutes = require("./src/projects/projectRoutes");
var UploadRoutes = require("./src/upload/uploadRoutes");
var ChatboxRoutes = require("./src/user_chatbox/userChatboxRoute");
var DashoardRoutes = require("./src/dashboard/dashboardRoutes");
var validateJwt = require("./src/config/jwt.handler");
var allRoutes = [...UserRoutes, ...ProjectRoutes,...UploadRoutes,...ChatboxRoutes,...DashoardRoutes];
var basePath = "/v1";

function GenerateRoutes(app) {
  allRoutes.map((row) => {
    app[row.method](basePath + row.path, function (req, res) {
       row.guard = false;
      if (row.guard) {
        validateJwt.verifyToken(req.headers.authorization, (data) => {
            if(data){
                row.callback(req, res, data);
            }else{
                res.status(401).json({status:false,message:'Session Expired'})
            }
        });
      } else {
        row.callback(req, res);
      }
    });
  });
}

module.exports = GenerateRoutes;
