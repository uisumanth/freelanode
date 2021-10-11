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

async function UserRegister(req, res) {
  const request = req.body;
  db = mongoUtil.getDb();
  // const validator = checkValidations(request);
  // if (validator.status) {
    const list = await db.collection("users").count({ email: request.email });
    if (list > 0) {
      res.json({
        status: false,
        message: "User already exist with this email ",
        data: null,
      });
    } else {
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
              freelancerTier: [
                { id: "1", name: "Tier 1", label: "Tier 1", value: "Tier 1" },
              ],
              email: request.email,
              languages: request.languages ? request.languages : [],
              skillSet: request.skillSet ? request.skillSet : [],
              addressLine1: request.add_line_1 ? request.add_line_1 : "",
              addressLine2: request.add_line_2 ? request.add_line_2 : "",
              landmark: request.landmark ? request.landmark : "",
              city: request.city ? request.city : "",
              pin: request.pin ? request.pin : "",
              state: request.state ? request.state : "",
              country: request.country ? request.country : "",
            },
            function (error, response) {
              if (error) {
                console.log("Error occurred while inserting");
                res.json({ status: false, data: null });
              } else {
                console.log("inserted record");
                res.json({ status: true, data: response.ops[0] });
              }
            }
          );
        }
      });
    }
  // }else{
  //   res.json({
  //     status: false,
  //     message: validator.message,
  //     data: null,
  //   });
  // }
}

function checkValidations(request) {
  let obj = { status: true, message: "" };
  if(!request.firstName){
    obj = { status: false, message: "Please enter First Name" };
  }else if(!request.lastName){
    obj = { status: false, message: "Please enter Last Name" };
  }else if(!request.dateOfBirth){
    obj = { status: false, message: "Please enter Date of Birth" };
  }else if(!request.phoneNumber){
    obj = { status: false, message: "Please enter Phone Number" };
  }else if(!request.role || (Array.isArray(request.role) && request.role.length == 0 )){
    obj = { status: false, message: "Please select Role" };
  }else if(!request.password){
    obj = { status: false, message: "Please enter Password" };
  }else if(!request.email){
    obj = { status: false, message: "Please enter Email" };
  }else if(!request.addressLine1){
    obj = { status: false, message: "Please enter Address Line1" };
  }else if(!request.state){
    obj = { status: false, message: "Please enter State" };
  }else if(!request.pin){
    obj = { status: false, message: "Please enter Pin Code" };
  }else if(!request.country){
    obj = { status: false, message: "Please enter Country" };
  }else if(!request.city){
    obj = { status: false, message: "Please enter City" };
  }

  return obj;
}

module.exports ={
  UserRegister:UserRegister,
  CheckValidations:checkValidations
} 
