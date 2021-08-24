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

const CreateBid = async (req, res,data) => {
  const request = req.body;
  db = mongoUtil.getDb();
  if(request.bidId){
    const updateStatus = await UpdateBid(request);
    if(updateStatus){
      res.json({data: null,status:true});
    }else{
      res.json({data: null,status:false});
    }
  }else{
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
            console.log("inserted create project record");
            await GetProjects.UpdateProjectStatus(request.projectId,{status:1});
            res.json({ status: true, data: response.ops[0] });
          }
        }
      );
    }
    });
  }
};

async function UpdateBid(request) {
  let query = { bidId: request.bidId };
  return db.collection("bids", async function (err, collection) {
    var bidDetails = await collection.findOne(query);
    if (bidDetails) {
      collection.updateOne(
        query,
        {
          $set:  {
            bidAmount: request.bidAmount,
            deliveredIn: request.deliveredIn,
            description: request.description,
            projectId: request.projectId,
            createdBy:request.userId,
            status:'Open'
          },
        },
        { acknowledged: true,multi:true },
        (err, doc) => {
          if (!err) {
            return true;
          } else {
            return false;
          }
        }
      );
    } else {
      return false;
    }
  });
}

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

  async function GetAllBidsByUser(req, res, data) {
    const request = req.body;
    db = mongoUtil.getDb();
    try {
      const query = [];
      if(request.userId){
        query.push({ createdBy:request.userId})
      }else{
        res.json({ status: false, data: null, message: "Please enter User ID" });
      }     
      var bidsDetails = [];
      var output = [];
      var cursor = db.collection("bids").find(...query);
      const promises = []
      await cursor.forEach(async function (doc) {
        doc["id"] = doc["_id"];
        bidsDetails.push(doc);
      });
      bidsDetails.forEach((each) => {
        const promise = getProjectDetailsForBid(each);
        promises.push(promise);
      })
      if(promises.length){
        Promise.all(promises).then((results) => {
          results.forEach((val,index)=> {
            if(val.assigned_userId == request.userId || val.assigned_userId == ""){
              output.push({...bidsDetails[index],...val});
            }
          })
          res.json({data: output,status:true});
        })
      }else{
      res.json({data: bidsDetails,status:true});
      }
    } catch (e) {
      console.log(e);
      res.json({ status: false, data: null, message: "No Bids Found" });
    }
  }

  async function getProjectDetailsForBid(bid){
    return await db.collection("projects").findOne({projectId:bid.projectId});
  }
module.exports = {
    GetAllBids:GetAllBids,
    GetAllBidsByUser:GetAllBidsByUser,
    CreateBid:CreateBid
} ;
