var CreateProject = require("./create-project");
var GetProjects = require("./getProjects");

const ProjectRoutes = [
  {
    path: "/createProject",
    method: "post",
    callback: CreateProject,
  },
  {
    path: "/getProjects",
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
