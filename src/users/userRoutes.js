var UserRegister = require("./register");
var LoginInsert = require("./login");
var UserProfile = require("./profile");

const UserRoutes = [
  {
    path: "/register",
    method: "post",
    callback: UserRegister,
    guard:false,
  },
  {
    path: "/login",
    method: "post",
    callback: LoginInsert,
    guard:false,
  },
  {
    path: "/getUserDetails",
    method: "post",
    callback: UserProfile.GetUser,
    guard:false,
  },
  {
    path: "/updateUser",
    method: "post",
    callback: UserProfile.UpdateUser,
    guard:false,
  },
];

module.exports = UserRoutes;
