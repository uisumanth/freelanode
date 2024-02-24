var mongoUtil = require("../../mongoUtil");
var ObjectId = require("mongodb").ObjectID;
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

async function UpdateUser(req, res, data) {
  const request = req.body;
  db = mongoUtil.getDb();

  db.collection("users", function (err, collection) {
    collection.updateOne(
      { user_id: request.userId },
      {
        $set: {
          firstName: request.firstName,
          lastName: request.lastName,
          role: request.role,
          dateOfBirth: request.dateOfBirth,
          phoneNumber: request.phoneNumber,
          languages: request.languages,
          skillSet: request.skillSet,
          addressLine1: request.add_line_1,
          addressLine2: request.add_line_2,
          landmark: request.landmark,
          city: request.city,
          pin: request.pin,
          state: request.state,
          country: request.country,
        },
      },
      { acknowledged: true },
      (err, doc) => {
        if (!doc) {
          res.json({ status: false, data: null, message: "Upadate Failed" });
        } else {
          return GetUser(req, res);
        }
      }
    );
  });
}

async function AllUsers(req, res) {
  const request = req.body;
  db = mongoUtil.getDb();
  const all_data = [];
  var query = { user_id: { $ne: parseInt(request.userId) } };
  var cursor = db.collection("users").find(query);
  await cursor.forEach(function (doc) {
    const role = doc.role && doc.role.length ? doc.role[0].value : null;
    if(role != "arbitrator"){
      all_data.push({
        user_id: doc.user_id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        user_img:doc.user_img
      });
    }
  });
  res.json({ status: true, data: all_data });
}

async function CreateMessage(req, res) {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = {
    "$or": [{
      user_id: request.userId,
      receipt_userId: request.receipt_userId,
    }, {
      user_id: request.receipt_userId,
      receipt_userId: request.userId,
    }]
};
  var userDetails = await db.collection("user_inbox").findOne(query);
  if (userDetails) {
    insertMessage(request, res, userDetails.chatId);
  } else {
    insertUserReciept(request, res);
  }
}

function insertUserReciept(req, res) {
  if(!req.userId || !req.receipt_userId){
    res.json({ status: false, data: null,message: "Please select User" });
  }else{
  getNextSequence(db, "userInbox", function (err, sequenceId) {
    if (!err) {
      db.collection("user_inbox").insertOne(
        {
          chatId: "C" + sequenceId,
          user_id: req.userId,
          receipt_userId: req.receipt_userId,
        },
        function (error, response) {
          if (error) {
            console.log("Error occurred while inserting creating message");
            res.json({ status: false, data: null });
          } else {
            console.log("inserted chat receiptant ");
            insertMessage(req, res, "C" + sequenceId);
          }
        }
      );
    }
  });
}
}

function insertMessage(req, res, sequenceId) {
  const body = {
    chatId: sequenceId,
    message: req.message,
    createdAt: new Date().getTime(),
    createdBy: req.createdBy,
  };
  db.collection("user_message").insertOne(
    body,
    function (error, response) {
      if (error) {
        console.log("Error occurred while inserting creating message");
        res.json({ status: false, data: null });
      } else {
        console.log("inserted chat message ");
        res.json({ status: true,data:body });
      }
    }
  );
}

async function GetMessagesByChatId(req, res) {
  const request = req.body;
  const rows = request.perPage ? parseInt(request.perPage) : 10;
  const page = request.page ? parseInt(request.page) : 1;
  db = mongoUtil.getDb();
  const allMessages = [];
  var query = { chatId: request.chatId };
  var messages = db
    .collection("user_message")
    .find(query)
   // .skip(rows * (page - 1))
   // .limit(rows * page);
  await messages.forEach((doc) => {
    allMessages.push(doc);
  });
  res.json({ status: true, data: allMessages });
}

async function DeleteMessageById(req, res) {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { _id: ObjectId(request.id) };
  db.collection("user_message").deleteOne(query, function (err, response) {
    if (err) {
      console.log("Error occurred while deleting message");
      res.json({ status: false, data: null });
    } else {
      console.log("deleted chat ");
      res.json({ status: true, data: null });
    }
  });
}

async function DeleteReceipt(req, res) {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { chatId: request.chatId };
  db.collection("user_inbox").deleteOne(query, function (err, response) {
    if (err) {
      console.log("Error occurred while deleting DeleteReceipt");
      res.json({ status: false, data: null });
    } else {
      db.collection("user_message").deleteMany(query, function (err, response) {
        if (err) {
          console.log("Error occurred while deleting DeleteReceipt");
          res.json({ status: false, data: null });
        } else {
          console.log("deleted chat ");
          res.json({ status: true, data: null });
        }
      });
    }
  });
}

async function UserChats(req, res) {
  const request = req.body;
  db = mongoUtil.getDb();
  const all_data = [];
  var query = {
    "$or": [{
        "user_id": parseInt(request.userId)
    }, {
        "receipt_userId": parseInt(request.userId)
    }]
};
  var cursor = db.collection("user_inbox").find(query);
  await cursor.forEach(async function (doc) {
    let key = "receipt_userId";
    if(request.userId == doc.receipt_userId){
      key = "user_id";
    }
    all_data.push({
      receipt_userId: doc[key],
      chatId: doc.chatId
    });
  });
  for (const each of all_data) {
    var details = await db
      .collection("users")
      .findOne({ user_id: each.receipt_userId });
    if (details) {
      each["firstName"] = details.firstName;
      each["lastName"] = details.lastName;
      each["user_img"] = details.user_img;
    }
  }
  res.json({ status: true, data: all_data });
}

module.exports = {
  AllUsers: AllUsers,
  CreateMessage: CreateMessage,
  GetMessages: GetMessagesByChatId,
  DeleteMessage: DeleteMessageById,
  DeleteReceipt: DeleteReceipt,
  UserChats: UserChats,
};
