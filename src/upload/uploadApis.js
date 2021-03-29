var Upload = require("./upload");
const multer = require('multer');

const singleUpload = (req, res) =>{
    Upload.singleUpload(req, res, function(err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any

      if (req.fileValidationError) {
          return res.send(req.fileValidationError);
      }
      else if (!req.file) {
          return res.send({status:false,message:'Please select an image to upload'});
      }
      else if (err instanceof multer.MulterError) {
          return res.send(err);
      }
      else if (err) {
          return res.send(err);
      }

      // Display uploaded image for user validation
      res.send({status:true,data:req.file});
  });
}

module.exports =  {
    singleUpload:singleUpload
    };