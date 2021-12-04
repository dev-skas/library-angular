const mongoose = require('mongoose');



mongoose.connect('mongodb+srv://syamjith:syamjith@library.quygf.mongodb.net/library?retryWrites=true&w=majority');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
        name: String,
        author: String,
        gener:String,
        year:Number,
        short:String,
        image:String ,       
});



var bookdata = mongoose.model('bookdata',BookSchema);

module.exports = bookdata;