var Dashboard = require("./dashboard");

const DashboardRoutes = [
  {
    path: "/getDashboardSearch",
    method: "post",
    callback: Dashboard.getDashboardSearch,
    guard:true
  },
];

module.exports = DashboardRoutes;
