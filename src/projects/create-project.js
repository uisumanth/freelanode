var mongoUtil = require("../../mongoUtil");
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

const CreateProject = (req, res, data) => {
  const request = req.body;
  db = mongoUtil.getDb();
  getNextSequence(db, "projectId", function (err, result) {
    if (!err) {
      db.collection("projects").insertOne(
        {
          projectId: result,
          title: request.title,
          description: request.description,
          skillsNeeded: request.skillSet,
          paymentType: request.paymentType,
          estimateBudget: request.estimateBudget,
          estimatedCurr: request.esCurr,
          estimatedVal: request.esValues,
          freelancerTier: request.freelancerTier,
          projectDueDate: request.projectDueDate,
          projectAttachments: request.projectAttachments
            ? request.projectAttachments
            : [],
          submissionAttachments: request.submissionAttachments
            ? request.submissionAttachments
            : [],
          userId: request.userId,
          assigned_userId: "",
          total_bids: request.total_bids ? request.total_bids : 0,
          avg_bid: request.avg_bid ? request.avg_bid : 0,
          bid_placed: request.bid_placed ? request.bid_placed : "",
          status: 0,
          proDueDate:request.proDueDate ? request.proDueDate : ""
        },
        function (error, response) {
          if (error) {
            console.log("Error occurred while inserting create project");
            res.json({ status: false, data: null });
          } else {
            console.log("inserted create project record");
            res.json({ status: true, data: response.ops[0] });
          }
        }
      );
    }
  });
};

const UpdateProject = (req, res, data) => {
  const request = req.body;
  db = mongoUtil.getDb();
  const updatedFields = ["title","description","skillSet","paymentType","estimateBudget","estimatedCurr","proDueDate",
  "estimatedVal","freelancerTier","projectDueDate","projectAttachments","submissionAttachments","total_bids","avg_bid"];
  const body = setBody(updatedFields,request);
  db.collection("projects", function (err, collection) {
    collection.updateOne(
      { projectId: request.projectId },
      {
        $set: {
          ...body
        },
      },
      { acknowledged: true },
      (err, doc) => {
        if (!doc) {
          res.json({ status: false, data: null, message: "Upadate Failed" });
        } else {
          return res.json({
            status: true,
            data: null,
            message: "Project updated Success",
          });
        }
      }
    );
  });
};


function setBody(array,data){
  const body = {};
  array.forEach(element => {
    if(data[element] !== undefined && data[element] !== null){
      body[element] = data[element];
    }
  });
  return body;
}

module.exports = {
  createProject: CreateProject,
  updateProject: UpdateProject,
};
