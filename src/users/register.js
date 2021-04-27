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

const UserRegister = (req, res) => {
  const request = req.body;
  db = mongoUtil.getDb();
  getNextSequence(db, "userid", function (err, result) {
    if (!err) {
      db.collection("users").insertOne(
        {
          user_id: result,
          firstName: request.firstName,
          lastName: request.lastName,
          role: request.customerRole,
          dateOfBirth: request.dateOfBirth,
          password: request.password,
          phoneNumber: request.phoneNumber,
          freelancerTier:[{"id": "1","name": "Tier 1","label": "Tier 1","value": "Tier 1"}],
          email: request.email,
          languages:request.languages ? request.languages : [],
          skillSet:request.skillSet ? request.skillSet : [],
          addressLine1:request.add_line_1 ? request.add_line_1 : '',
          addressLine2:request.add_line_2 ? request.add_line_2 :'',
          landmark:request.landmark ? request.landmark : '',
          city:request.city ? request.city : '',
          pin:request.pin ? request.pin :'',
          state:request.state ?request.state :'',
          country:request.country ? request.country:''
        },
        function (error, response) {
          if (error) {
            console.log("Error occurred while inserting");
            res.json({ status: false, data: null });

          } else {
            console.log("inserted record", response.ops[0]);
            res.json({ status: true, data: response.ops[0] });
          }
        }
      );
    }
  });
};

module.exports = UserRegister;
