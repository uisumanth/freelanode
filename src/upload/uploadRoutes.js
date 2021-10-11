var Upload = require("./uploadApis");

  const UploadRoutes = [
  {
    path: "/upload",
    method: "post",
    callback: Upload.singleUpload,
    guard:true
  },
];

module.exports = UploadRoutes;