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
  var query = { projectId: request.projectId, userId: request.userId };
  var projectDetails = await db.collection("projects").findOne(query);
  if (projectDetails) {
    var bidsDetails = await GetProjectsBids(request);
    res.json({ status: true, data: { ...projectDetails, bids: bidsDetails } });
  } else {
    res.json({ status: false, data: null, message: "Project not Found" });
  }
}

async function GetProjectsBids(req) {
  try {
    var bidsDetails = [];
    var cursor = db.collection("bids").find({ projectId: req.projectId });
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
  const all_data = [];
  var cursor = db.collection("projects").find(query);
  await cursor.forEach(function (doc) {
    all_data.push(doc);
  });
  res.json({ status: true, data: all_data });
}

function UpdateProjectStatus(projectId, status) {
  db = mongoUtil.getDb();
  let query = { projectId: projectId };
  db.collection("projects", function (err, collection) {
    var projectDetails = collection.findOne({ query });
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
          if (!doc) {
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
module.exports = {
  AllProjects: GetAllProject,
  ProjectById: ProjectById,
  GetProjectsByUser: GetProjectsByUser,
  UpdateProjectStatus: UpdateProjectStatus,
};
