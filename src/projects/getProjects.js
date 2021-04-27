const { request } = require("express");
var mongoUtil = require("../../mongoUtil");
var db;

async function GetAllProject(req, res, data) {
  const request = req.body;
  db = mongoUtil.getDb();
  const all_data = [];
  var cursor = db.collection("projects").find();
  await cursor.forEach(function (doc) {
    doc["id"] = doc["_id"];
    all_data.push(doc);
  });
  res.json({ status: true, data: all_data });
}

async function ProjectById(req, res, data) {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { projectId: request.projectId };
  var projectDetails = await db.collection("projects").findOne(query);
  var userDetails = await db.collection("users").findOne({user_id: projectDetails.userId });

  if (projectDetails) {
    var bidsDetails = await GetProjectsBids(request);
    res.json({ status: true, data: { ...projectDetails, bids: bidsDetails ? bidsDetails[0]: null,userDetails:userDetails } });
  } else {
    res.json({ status: false, data: null, message: "Project not Found" });
  }
}

async function GetProjectsBids(req) {
  try {
    var bidsDetails = [];
    var query = { projectId: req.projectId };
    if(req.userId !== undefined && req.userId !== null){
      query['createdBy'] = req.userId;
    }
    var cursor = db.collection("bids").find(query);
    await cursor.forEach(function (doc) {
      doc["id"] = doc["_id"];
      bidsDetails.push(doc);
    });
    return bidsDetails;
  } catch (e) {
    console.log(e);
  }
}
async function GetProjectsByUser(req, res, data) {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { userId: request.userId };
  if(request.status_code !== undefined && request.status_code !== null){
    query['status'] = parseInt(request.status_code);
  }
  const all_data = [];
  var cursor = db.collection("projects").find(query);
  await cursor.forEach(function (doc) {
    all_data.push(doc);
  });
  res.json({ status: true, data: all_data });
}

async function UpdateProjectStatus(projectId, status) {
  db = mongoUtil.getDb();
  let query = { projectId: projectId };
  await db.collection("projects", async function (err, collection) {
    var projectDetails = await collection.findOne(query);
    if (projectDetails && projectDetails.status < status) {
      collection.updateOne(
        query,
        {
          $set: {
            status: status,
          },
        },
        { acknowledged: true },
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
 async function markAsAward(req,res){
  const request = req.body;
  db = mongoUtil.getDb();
  try{
    const status  = await UpdateProjectStatus(request.projectId,3);
    console.log("status",status)
    if(status){
      res.json({ status: true, data: null });
      }else{
      res.json({ status: true, data: null });
      // res.json({ status: false, data: "Update failed" });
      }
  }
  catch(err){
    res.json({ status: false, data: "Update failed" });
  }
}

function markAsArbitrator(req,res){
  const request = req.body;
  db = mongoUtil.getDb();
  try{
    const status  = UpdateProjectStatus(request.projectId,4);
    if(status){
      res.json({ status: true, data: null });
      }else{
        res.json({ status: true, data: null });
        // res.json({ status: false, data: "Update failed" });
      }
  }
  catch(err){
    res.json({ status: false, data: "Update failed" });
  }
}

 function markAsComplete(req,res){
  const request = req.body;
  db = mongoUtil.getDb();
  try{
    const status  = UpdateProjectStatus(request.projectId,5);
    if(status){
    res.json({ status: true, data: null });
    }else{
      res.json({ status: true, data: null });
      // res.json({ status: false, data: "Update failed" });
    }
  }
  catch(err){
    res.json({ status: false, data: "Update failed" });
  }
}
function acceptBid(req,res){
  const request = req.body
  db = mongoUtil.getDb();
  let query = { projectId: request.projectId };
  db.collection("projects", function (err, collection) {
    var projectDetails = collection.findOne({ query });
    if (projectDetails && !projectDetails.bidId ) {
      collection.updateOne(
        query,
        {
          $set: {
            status: 2,
            bidId:request.bidId
          },
        },
        { acknowledged: true },
        (err, doc) => {
          if (!err) {
            res.json({ status: true, data: null });
          } else {
            res.json({ status: false, data: "Unable to accept bid" });
          }
        }
      );
    } else {
      res.json({ status: false, data: "Unable to accept bid" });
    }
  });
}
module.exports = {
  AllProjects: GetAllProject,
  ProjectById: ProjectById,
  GetProjectsByUser: GetProjectsByUser,
  UpdateProjectStatus: UpdateProjectStatus,
  markAsComplete:markAsComplete,
  markAsArbitrator:markAsArbitrator,
  markAsAward:markAsAward,
  acceptBid:acceptBid
};
