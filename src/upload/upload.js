const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/'); // Make sure this folder exists
    },
    filename: function(req, file, cb) {
        var ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }
});
   
  var upload = multer({ storage: storage }).single('file')

 
  module.exports =  {
    singleUpload:upload
    };