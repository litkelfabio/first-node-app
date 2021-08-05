const mongoose = require('mongoose');

//note: the last / on the url is the db name that will be use
mongoose.connect('mongodb://localhost:27017/task-manager-api', {
     useNewUrlParser: true, 
     useCreateIndex: true,  
     useUnifiedTopology: true,
     useFindAndModify: false
    });
