var Project = require("./create-project");
var GetProjects = require("./getProjects");
var Bids = require("./bids");
var ProjectFilter = require('./searchProjects');
const ProjectRoutes = [
  {
    path: "/createProject",
    method: "post",
    callback: Project.createProject,
    guard:true
  },
  {
    path: "/updateProject",
    method: "post",
    callback: Project.updateProject,
    guard:true
  },
  {
    path: "/getProjectsByUser",
    method: "post",
    callback: GetProjects.GetProjectsByUser,
    guard:true
  },
  {
    path: "/getAllProjects",
    method: "post",
    callback: GetProjects.AllProjects,
    guard:true
  },
  {
    path: "/getProjectsById",
    method: "post",
    callback: GetProjects.ProjectById,
    guard:true
  },
  {
    path: "/createBid",
    method: "post",
    callback: Bids.CreateBid,
    guard:true
  },
  {
    path: "/getRecentBids",
    method: "get",
    callback: Bids.GetAllBids,
    guard:true
  },
  {
    path: "/getRecentBids",
    method: "post",
    callback: Bids.GetAllBidsByUser,
    guard:true
  },
  {
    path: "/searchProjects",
    method: "post",
    callback: ProjectFilter.searchProducts,
    guard:true
  },
  {
    path: "/markAsComplete",
    method: "post",
    callback: GetProjects.markAsComplete,
    guard:true
  },
  {
    path: "/markAsAward",
    method: "post",
    callback: GetProjects.markAsAward,
    guard:true
  },
  {
    path: "/markAsArbitrator",
    method: "post",
    callback: GetProjects.markAsArbitrator,
    guard:true
  },
  {
    path: "/acceptBid",
    method: "post",
    callback: GetProjects.acceptBid,
    guard:true
  },
  {
    path: "/getProjectBids",
    method: "post",
    callback: GetProjects.getProjectsBids,
    guard:true
  },
  {
    path: "/getProjectsByStatus",
    method: "post",
    callback: GetProjects.getProjectsByStatus,
    guard:true
  },
  {
    path: "/getAnalytics",
    method: "post",
    callback: ProjectFilter.getAnalytics,
    guard:true
  },
  {
    path: "/downloadPath",
    method: "get",
    callback: GetProjects.downloadPath,
    guard:true
  },
  {
    path: "/updateAttachements",
    method: "post",
    callback: GetProjects.updateProjectAttachements
    ,
    guard:true
  },
  
];

module.exports = ProjectRoutes;
