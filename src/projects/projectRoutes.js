var CreateProject = require("./create-project");
var GetProjects = require("./getProjects");

const ProjectRoutes = [
  {
    path: "/createProject",
    method: "post",
    callback: CreateProject,
  },
  {
    path: "/getProjectsByUser",
    method: "post",
    callback: GetProjects.GetProjectsByUser,
  },
  {
    path: "/getAllProjects",
    method: "post",
    callback: GetProjects.AllProjects,
  },
  {
    path: "/getProjectsById",
    method: "post",
    callback: GetProjects.ProjectById,
  },
];

module.exports = ProjectRoutes;
