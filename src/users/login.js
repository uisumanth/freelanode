var mongoUtil = require("../../mongoUtil");
var db;

const LoginInsert = (req, res) => {
  const request = req.body;
  db = mongoUtil.getDb();
  var query = { email: request.email, password: request.password };
  db.collection("users", function (err, collection) {
    collection.findOne(query, function (err, item) {
      console.log(err);
      if (!item) {
        res.json({ status: false, data: null, message: "User not Found" });
      } else {
        res.json({ status: true, data: item });
      }
    });
  });
};

module.exports = LoginInsert;
