var Dashboard = require("./dashboard");

const DashboardRoutes = [
  {
    path: "/getDashboardAnalytics",
    method: "post",
    callback: Dashboard.getDashboardAnalytics,
    guard:true
  },
];

module.exports = DashboardRoutes;
