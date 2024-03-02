const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,'ownerUploads/hostlePic/');
    },
    filename:function(req, file, cb){
        const extension = path.extname(file.originalname); 
        const userEmail = req.body.email;
        cb(null,userEmail+Date.now()+extension);            //userEmail+"_"+Date.now()+"_"+file.originalname
    }
});

const fileFilter = (req,file,cb)=>{
    // file extension filter
    const validExt = ['.png','.jpg','.jpeg'];
    if(!validExt.includes(path.extname(file.originalname)))
    {
        return cb(new Error("only .png, .jpg .jpeg are allowed"));
    }

    //file size filtering
    const fileSize = parseInt(req.header['content-lenght']);
    if(fileSize>1048576){
        return cb(new Error("file size is big"));
    }

    cb(null,true);
};

let upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    fileSize:1048576 // 10mb
});

module.exports = upload;