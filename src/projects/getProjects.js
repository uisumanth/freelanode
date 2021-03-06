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

module.exports = GetProject;
