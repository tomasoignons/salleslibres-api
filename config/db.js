const mongoose = require("mongoose")


//ici normalement il faut connecter en online, mais on le fait en local, puisque le style.
mongoose
    .connect(process.env.MONGO_URL, 
    {useNewUrlParser: true, 
    useUnifiedTopology: true});

db = mongoose.connection;db.on('error', console.error.bind(console, 'connection error:'));db.once('open', function() {  console.log("connecté à Mongoose")});

