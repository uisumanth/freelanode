const e = require("express");
const { request } = require("express");
var mongoUtil = require("../../mongoUtil");
var db;

async function GetAllProject(req, res, data) {
  const request = req.body;
  db = mongoUtil.getDb();
  const all_data = [];
  const query = [];
  if(request.status){
    request.status = request.status.map(each => parseInt(each))
    query.push({ status: { $in: request.status }})
  }
  var cursor = db.collection("projects").find(...query);
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
  var userDetailsResp = await db.collection("users").findOne({user_id: projectDetails.userId });
  var userDetails = {...userDetailsResp};
  delete userDetails.password;
  if (projectDetails) {
    var bidQuery = { projectId: request.projectId };
    if(request.userId !== undefined && request.userId !== null){
      bidQuery['createdBy'] = request.userId;
    }
    if(projectDetails['bidId']){
      bidQuery = { bidId: projectDetails['bidId']};
    }
    var bidsDetails = await GetProjectsBids(bidQuery);
    var bidUserDetails = null;
    if(bidsDetails){
      bidUserDetailsResp = await db.collection("users").findOne({user_id: bidsDetails[0].createdBy });
      if(bidUserDetailsResp){
        bidUserDetails = {...bidUserDetailsResp};
        delete bidUserDetailsResp.password;
      }
    }
    res.json({ status: true, data: { 
      ...projectDetails,
       bids: bidsDetails ? bidsDetails[0]: null,
       userDetails:userDetails,bidUserDetails:bidUserDetails 
      }
     });
  } else {
    res.json({ status: false, data: null, message: "Project not Found" });
  }
}

async function GetProjectsBids(query) {
  try {
    var bidsDetails = [];
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

async function GetProjectsBidsApi(req,res) {
  const request = req.body;
  db = mongoUtil.getDb();
  try {
    var bidsDetails = [];
    var query = { projectId: request.projectId };
    if(request.userId !== undefined && request.userId !== null){
      query['createdBy'] = request.userId;
    }
    var cursor = db.collection("bids").find(query);
    const promises = []
    await cursor.forEach(async function (doc) {
      doc["id"] = doc["_id"];
      doc['userDetails'] = null;
      bidsDetails.push(doc);
    });
    bidsDetails.forEach((each) => {
      const promise = getUSerDetailsFOrBid(each);
      promises.push(promise);
    })
    if(promises.length){
      Promise.all(promises).then((results) => {
        results.forEach((val,index)=> {
          bidsDetails[index]['userDetails'] = val;
        })
        res.json({data: bidsDetails,status:true});
      })
    }else{
    res.json({data: bidsDetails,status:true});
    }
  } catch (e) {
    console.log(e);
    res.json({ status: false, data: null, message: "No Bids Found" });
  }
}

async function getUSerDetailsFOrBid(bid){
  return await db.collection("users").findOne({user_id:bid.createdBy});
  bidsDetails.forEach(async (each) => {
    each["userDetails"] = null;
    var userDetails = await db.collection("users").findOne({user_id:each.createdBy});
    console.log(userDetails)
    if(userDetails){
      each["userDetails"] = userDetails
    }
  })
  console.log("rteurn")
  return bidsDetails;
}
async function GetProjectsByUser(req, res, data) {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { userId: request.userId };
  if(request.status_code !== undefined && request.status_code !== null){
    query['status'] = parseInt(request.status_code);
  }
  if(request.search){
    query['title']  = new RegExp('.*' +  request.search + '.*');
  }
  const all_data = [];
  var cursor = db.collection("projects").find(query);
  await cursor.forEach(function (doc) {
    all_data.push(doc);
  });
  res.json({ status: true, data: all_data });
}

async function UpdateProjectStatus(projectId, status,judge="",type="") {
  db = mongoUtil.getDb();
  let query = { projectId: projectId };
  const result = await db.collection("projects").findOne(query);
  let body = {
    status:status
  };
  if(judge){
    body["judgement"] = judge;
  }
  if(type === "employer"){
    body["employerStatus"] = true;
  }else if(type === "freelancer"){
    body["freelancerStatus"] = true;
  }

  if(result["employerStatus"] && result["freelancerStatus"]){
    body["status"] = 5  
  }
 console.log(body)
  await db.collection("projects", async function (err, collection) {
    var projectDetails = await collection.findOne(query);
    if (projectDetails && (projectDetails.status < status || status === 6)) {
      collection.updateOne(
        query,
        {
          $set: body,
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
    const type = request.type;
    let statusType = 6;
    if(type){
      statusType = 5;
    }
    let status = "";
    if(type){
      status = UpdateProjectStatus(request.projectId,statusType,null,type);
    }else{
    let judge ="";
    if(request.judgement){
      judge = request.judgement
    }
     status = UpdateProjectStatus(request.projectId,5,judge);
    }
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

async function GetProjectsByStatus(req, res, data) {
  const request = req.body;
  db = mongoUtil.getDb();
  const all_data = [];
  var cursor = db.collection("projects").find({status:request.status});
  await cursor.forEach(function (doc) {
    doc["id"] = doc["_id"];
    all_data.push(doc);
  });
  res.json({ status: true, data: all_data });
}

function downloadPath(req,res){
  const request = req.query;
  if(request.path){
   const path = request.path.split('/');
    const file = `public/uploads/${request.path}`;
    res.download(file,path[path.length-1]); 
  }else{
    res.json({status:false,message:"Path not found"});
  }
}

async function updateProjectAttachements(req,res){
  const request = req.body;
  if(request.projectId){
    db = mongoUtil.getDb();
  let query = { projectId: request.projectId };
    let updateObj = {};
  if(request.projectAttachments != undefined){
    updateObj["projectAttachments"] = request.projectAttachments
  }
  if(request.submissionAttachments !=undefined){
    updateObj["submissionAttachments"] = request.submissionAttachments
  }
  await db.collection("projects", async function (err, collection) {
    var projectDetails = await collection.findOne(query);
    if (projectDetails) {
      collection.updateOne(
        query,
        {
          $set:updateObj,
        },
        { acknowledged: true },
        (err, doc) => {
          if (!err) {
            res.json({status:true,message:"Success"});
          } else {
            res.json({status:false,message:"Project Id not found"});

          }
        }
      );
    } else {
      res.json({status:false,message:"Project Id not found"});

    }
  });
  }else{
    res.json({status:false,message:"Project Id not found"});
  }
}
module.exports = {
  AllProjects: GetAllProject,
  ProjectById: ProjectById,
  GetProjectsByUser: GetProjectsByUser,
  UpdateProjectStatus: UpdateProjectStatus,
  markAsComplete:markAsComplete,
  markAsArbitrator:markAsArbitrator,
  markAsAward:markAsAward,
  acceptBid:acceptBid,
  getProjectsBids:GetProjectsBidsApi,
  getProjectsByStatus:GetProjectsByStatus,
  downloadPath:downloadPath,
  updateProjectAttachements:updateProjectAttachements
};
