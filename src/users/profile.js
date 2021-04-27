var mongoUtil = require("../../mongoUtil");
var db;

async function UpdateUser(req, res,data) {
  const request = req.body;
  db = mongoUtil.getDb();

  db.collection("users", function (err, collection) {
      collection.updateOne({user_id: request.userId}, 
    {$set:{
        firstName: request.firstName,
        lastName: request.lastName,
        role: request.role,
        dateOfBirth: request.dateOfBirth,
        phoneNumber: request.phoneNumber,
        languages:request.languages,
        skillSet:request.skillSet,
        addressLine1:request.add_line_1,
        addressLine2:request.add_line_2,
        landmark:request.landmark,
        city:request.city,
        pin:request.pin,
        state:request.state,
        country:request.country
      }}, {acknowledged:true}, (err, doc) => {
        if (!doc) {
            res.json({ status: false, data: null, message: "Upadate Failed" });
          } else {
            return GetUser(req,res)
          }
})
})

}

const GetUser = (req, res) => {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { user_id: request.userId };
  db.collection("users", function (err, collection) {
    collection.findOne(query, function (err, item) {
      console.log(err);
      if (!item) {
        res.json({ status: false, data: null, message: "User not Found" });
      } else {
          const response = {...item};
          delete response.password;
        res.json({ status: true, data: response });
      }
    });
  });
};


module.exports = {
  GetUser: GetUser,
  UpdateUser: UpdateUser,
};
