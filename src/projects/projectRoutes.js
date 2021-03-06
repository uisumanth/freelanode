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
    callback: GetProjects,
  },
];

module.exports = ProjectRoutes;
