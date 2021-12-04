const express = require('express');
const app = new express();
const path = require('path');

const bookdata = require('./model/bookdata');
const authordata = require('./model/authordata');
const userdata = require('./model/userdata');
const cors = require('cors');
app.use(cors());
app.use(express.json())

app.use(express.static('./dist/frontend'));
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 1000;






function verify(req, res, nxt) {

    if (!req.headers.authorization) {
        return res.status(401).send('Invalid Request')
    }
    let token = req.headers.authorization.split('')[1]
    if (token == 'null') {
        return res.status(401).send('invalid login')
    }

    let payload = jwt.verify(token, 'secretkey')
    
    console.log(payload)
    console.log(token)

    if (!payload) {
        return res.send(401).send('Invalid Request')
    }
    
    req.userId = payload.subject
    next()
}


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

// books

app.get('/api/books', (req, res) => {
    bookdata.find().then((books) => {
        res.send(books)
    })
})
app.get('/api/books/:id', (req, res) => {
    bookdata.find({_id: req.params.id}).then((books) => {
        res.send(books)
    })
})



app.get('/api/books/delete/:id', (req, res) => {
 
    bookdata.deleteOne({_id:req.params.id},(err,result)=>{
       
        bookdata.find().then((books) => {
            res.send(books)
        })
        
    })

   
})

app.post('/api/addbook', (req, res) => {
    

    var item ={
      name:  req.body.name,
      author: req.body.authorName,
      gener:  req.body.Category,
      year:req.body.year,
      short: req.body.about,
      image: req.body.image
   }
  
   var book = new bookdata(item);
      book.save()
   
         
});

app.post('/api/updatebook',(req,res)=>{
    
    const id = req.body._id



    bookdata.findByIdAndUpdate(id,{
        name:  req.body.name,
        author: req.body.author,
        gener:  req.body.gener,
        year:req.body.year,
        short: req.body.short,
        image: req.body.image
    },(err,result)=>{
        res.send(result)

      })

   });






//Authors

app.get('/api/authors', (req, res) => {
    authordata.find().then((authors) => {
        res.send(authors)
    })
})




app.get('/api/authors/:id', (req, res) => {
    authordata.find({_id: req.params.id}).then((author) => {
        res.send(author)
    })
})

app.get('/api/authors/delete/:id', (req, res) => {
 
    authordata.deleteOne({_id:req.params.id},(err,result)=>{
       
        authordata.find().then((author) => {
            res.send(author)
        })
        
    })

   
})




     


app.post('/api/addauthor', (req, res) => {
    

    var item = {
        name: req.body.authorName,
        image: req.body.file,
        year:req.body.DOB,
        country:req.body.Country,
        short:req.body.about  
    }
    var author = authordata(item);
    author.save();
 
       
});


app.post('/api/updateauthore',(req,res)=>{
    
    const id = req.body._id

//  

  authordata.findByIdAndUpdate(id,{
    name: req.body.name,
    image: req.body.image,
    year:req.body.year,
    country:req.body.country,
    short:req.body.short  
    },(err,result)=>{
        res.send(result)
      })

   });

//login in 

// username = "admin";
// password="12345"

// app.post('/login', (req, res) => {

//     let userdata = req.body
//     console.log(req.body)
   
//     userdata.findOne({uname: userdata.},(err,user)=>{
    
//         username = user.uname
//         password = user.pwd

//     if (!username) {
//         res.status(401).send('Invalid Username');

//     } else if (password !== userdata.password) {
//         res.status(401).send('Invalid Password')
//     } else {
//         let payload = { 
//             subject:username+password
//         }
//         let token = jwt.sign(payload,'secretkey')
//         res.status(200).send({token})
//     }
    
// })


app.post('/api/login', (req, res) => {


    const username = req.body.uname
    const  password = req.body.password
   

       userdata.findOne({uname: username},(err,user)=>{
        if(user == null){
            msg = "invalid User";
            res.status(401).send({ err_msg:msg,type:'danger'});
           
        }else{
           if(password == user.pwd){
            let payload = { 
                subject:username+password
            }
               let token = jwt.sign(payload, 'secretkey')
               if (user.role == "admin") {
                res.status(200).send({token,role:"admin"})
               } else {
                res.status(200).send({token,role:"user"})
                   
               }
         

            }else{
               msg = "Incorrect Password";
               res.status(401).send({ err_msg: msg, type:'warning' })
                 
             }
        }
       })

    
  

});



app.post('/api/signup',(req,res)=>{

       


    userdata.findOne({uname: req.body.username},(err,user)=>{
     if(user == null){
        var item = {
            uname:req.body.username,
            pwd: req.body.password,
            role:req.body.role

        }
          var user = userdata(item);
         user.save();
         res.status(200).send()
         
     }else{

        msg = "User Alreday Exist";     
        res.status(401).send({ err_msg: msg, type:'warning' })
     }

    })
   
});


app.get('/api/users', (req, res) => {
    userdata.find().then((users) => {
        res.send(users)
    })
})


app.get('/api/user/delete/:id', (req, res) => {
 
    userdata.deleteOne({_id:req.params.id},(err,result)=>{
       
        userdata.find().then((books) => {
            res.send(books)
        })
        
    })

   
})

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname + "/dist/frontend/index.html"));
  });
   
app.listen(port,()=>{console.log(`Server Ready at ${port}`)});