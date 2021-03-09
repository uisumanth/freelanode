var UserRegister = require("./register");
var LoginInsert = require("./login");

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
];

module.exports = UserRoutes;
