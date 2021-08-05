const mongoose = require('mongoose');

//note: the last / on the url is the db name that will be use
mongoose.connect(process.env.MONGODB_URL, {
     useNewUrlParser: true, 
     useCreateIndex: true,  
     useUnifiedTopology: true,
     useFindAndModify: false
    });
