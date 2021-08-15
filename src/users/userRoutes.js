var Register = require("./register");
var LoginInsert = require("./login");
var UserProfile = require("./profile");
var ResetPassword = require("./resetPassword");

const UserRoutes = [
  {
    path: "/register",
    method: "post",
    callback: Register.UserRegister,
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
    guard:true,
  },
  {
    path: "/updateUser",
    method: "post",
    callback: UserProfile.UpdateUser,
    guard:true,
  },
  {
    path: "/resetPassword",
    method: "post",
    callback: ResetPassword,
    guard:false,
  },
];

module.exports = UserRoutes;
