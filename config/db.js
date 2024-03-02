const mongoose = require('mongoose');
//mongoose.Promise= global.Promise; 

mongoose.connect('mongodb://127.0.0.1:27017/findpg').then(()=>{
    console.log('db is connected')
}).catch((err)=>{
    console.log("db can't connected"+err.message)
});