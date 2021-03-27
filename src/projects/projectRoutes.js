var CreateProject = require("./create-project");
var GetProjects = require("./getProjects");
var CreateBid = require("./bids");

const ProjectRoutes = [
  {
    path: "/createProject",
    method: "post",
    callback: CreateProject,
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
    callback: CreateBid,
    guard:true
  },
];

module.exports = ProjectRoutes;
