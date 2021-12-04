const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://syamjith:syamjith@library.quygf.mongodb.net/library?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    uname : String,
    pwd : String,
    role : String
})

var userdata = mongoose.model('userdata',userSchema);
module.exports = userdata;