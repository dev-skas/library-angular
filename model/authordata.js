const mongoose = require('mongoose');



mongoose.connect('mongodb+srv://syamjith:syamjith@library.quygf.mongodb.net/library?retryWrites=true&w=majority');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
        name: String,
        image: String,
        year: String,
        country:String,
        short:String        

      
});


var authordata = mongoose.model('authordata',AuthorSchema);

module.exports = authordata; 