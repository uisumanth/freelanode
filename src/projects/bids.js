var mongoUtil = require("../../mongoUtil");
var GetProjects = require("./getProjects");

var db;

function getNextSequence(db, name, callback) {
  db.collection("counters").findAndModify(
    { _id: name },
    null,
    { $inc: { seq: 1 } },
    function (err, result) {
      if (err) callback(err, result);
      callback(err, result.value.seq);
    }
  );
}

const CreateBid = (req, res,data) => {
  const request = req.body;
  db = mongoUtil.getDb();
  getNextSequence(db, "bidId", function (err, result) {
    if (!err) {
      db.collection("bids").insertOne(
        {
          bidId: result,
          bidAmount: request.bidAmount,
          deliveredIn: request.deliveredIn,
          description: request.description,
          projectId: request.projectId,
          createdBy:request.userId,
          status:'Open'
        },
        async function (error, response) {
          if (error) {
            console.log("Error occurred while inserting create project");
            res.json({ status: false, data: null });
          } else {
            console.log("inserted create project record", response.ops[0]);
            await GetProjects.UpdateProjectStatus(request.projectId,1);
            res.json({ status: true, data: response.ops[0] });
          }
        }
      );
    }
  });
};


async function GetAllBids(req, res, data) {
    db = mongoUtil.getDb();
    const all_data = [];
    var cursor = db.collection("bids").find().limit(10);
    await cursor.forEach(function (doc) {
      doc["id"] = doc["_id"];
      all_data.push(doc);
    });
    res.json({ status: true, data: all_data });
  }

module.exports = {
    GetAllBids:GetAllBids,
    CreateBid:CreateBid
} ;
