var mongoUtil = require("../../mongoUtil");
var db;

const resetPassword = (req, res) => {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { email: request.email, password: request.password };
  if (!request.newPassword) {
    res.json({
      status: false,
      data: null,
      message: "Please enter New Password",
    });
  }
  db.collection("users", function (err, collection) {
    collection.updateOne(
     query,
      {
        $set: {
          password: request.newPassword,
        },
      },
      { acknowledged: true },
      (err, doc) => {
        if (doc && doc.result.n == 0) {
          res.json({ status: false, data: null, message: "User not Found" });
        } else {
          res.json({
            status: true,
            data: null,
            message: "Password Changed Successfully",
          });
        }
      }
    );
  });
};

module.exports = resetPassword;
