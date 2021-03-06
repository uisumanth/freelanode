var UserRegister = require("./register");
var LoginInsert = require("./login");

const UserRoutes = [
  {
    path: "/register",
    method: "post",
    callback: UserRegister,
  },
  {
    path: "/login",
    method: "post",
    callback: LoginInsert,
  },
];

module.exports = UserRoutes;
