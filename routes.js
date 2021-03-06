var UserRoutes = require('./src/users/userRoutes');
var ProjectRoutes = require('./src/projects/projectRoutes');

var allRoutes = [...UserRoutes,...ProjectRoutes];
var basePath = '/v1'

function GenerateRoutes(app){
    allRoutes.map(row => {
        app[row.method](basePath + row.path,row.callback);
    })
}

module.exports = GenerateRoutes