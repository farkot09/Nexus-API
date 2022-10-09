const multer = require("multer")

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "upload")
  },
  filename: function(req,file,cb){
    cb(null, file.fieldname)
  }
})

const upload = multer({storage: storage})

exports.upload = upload.single("myfile")


