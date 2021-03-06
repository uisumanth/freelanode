var mongoUtil = require("../../mongoUtil");
var db;

async function GetProject (req, res) {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { userId: request.userId };
  const all_data = [];
  var cursor = db.collection('projects').find(query);
    await cursor.forEach(function(doc){
        all_data.push(doc)
    })
    res.json({ status: true, data: all_data });
};

const ProjectById = (req, res) => {
    const request = req.body;
    db = mongoUtil.getDb();
    var query = { projectId: request.projectId, userId: request.userId };
    db.collection("projects", function (err, collection) {
      collection.findOne(query, function (err, item) {
        console.log(err);
        if (!item) {
          res.json({ status: false, data: null, message: "User not Found" });
        } else {
          res.json({ status: true, data: item });
        }
      });
    });
  };
module.exports = {
    AllProjects:GetProject,
    ProjectById: ProjectById
};
