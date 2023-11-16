//middleware for handling file uploads using the multer library
const multer=require("multer")
const storage=multer.diskStorage({
    destination:function (req,res,cb) {
        cb(null,"uploads/")//Directory where the uploaded files will be stored
    },
    filename:function(req,file,cb){ //This  function  determines the name of the uploaded file.
        const uniqueSuffix=Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename=file.originalname.split(".")[0];
        cb(null,filename + "-" + uniqueSuffix + ".png")
    }
})
exports.upload=multer({storage:storage})