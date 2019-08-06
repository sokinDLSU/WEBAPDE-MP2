//index.js

const express = require("express")
const bodyparser = require("body-parser")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")

const {User} = require("./user.js")

const app = express()
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/userss19",{
    useNewUrlParser : true 
})

const urlencoder = bodyparser.urlencoded({
    extended: false
    //using the extended version of the url u're encoding
})

app.use(express.static(__dirname + "/public"))
app.use(session({
    secret: "secret name",
    name: "chocolate cookie",
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*60*24*365
    }
}))

app.use(cookieparser())

app.get("/", (req,res)=>{
    //read cookie
    //see preferred font size
    let fs = 12
    if(req.cookies["font size"]){
        fs = req.cookies["font size"]
    }
    if(req.session.username){
        res.render("home.hbs",{
            username: req.session.username,
            fontsize: fs
        })
    }else{
        res.sendFile(__dirname + "/public/login.html")
    }
})
app.get("/users",(req,res)=>{
    //load all data of all users
    console.log("GET /users")
    User.find({}, (err, docs)=>{
        if(err){
            res.send(err)
        }else{
            console.log(docs)
            res.render("admin.hbs", {
                users:docs
                    
            })
        }
    })
})

app.get("/edit",(req,res)=>{
    User.findOne({
        _id : req.query.id
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }else{
            res.render("edit.hbs", {
                    user:doc
            })
        }
    })
})

app.get("/addpage",(req,res)=>{
    res.render("add.hbs")
})

app.post("/add", urlencoder, (req,res)=>{
    let username = req.body.un
    let password = req.body.pw
    
    let user = new User({
        username, password
    })
    user.save().then((doc)=>{
        User.find({}, (err,doc))
    }, (err)=>{
        
    })
})

app.post("/delete", urlencoder, (req,res)=>{
    
})

app.post("/update", urlencoder, (req,res)=>{
    
})


app.post("/login", urlencoder, (req,res)=>{
    let username = req.body.un
    let password = req.body.pw
    
    User.findOne({
        username : username,
        password : password
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }else if(!doc){
            res.send("User does not exist")
        }else{
            console.log(doc)
            req.session.username = doc.username
            res.redirect("/")
        }
    })
})

app.post("/register", urlencoder, (req, res)=>{
    let username = req.body.un
    let password = req.body.pw
    
    let user = new User({
        username : username,
        password : password
    })
    
    user.save().then((doc)=>{
        // if operation goes well
        console.log(doc)
        req.session.username = doc.username
        res.redirect("/")
    },(err)=>{
        // if operation goes wrong
    })
})

app.post("/preferences", urlencoder, (req,res)=>{
    let fs = req.body.fontsize
    res.cookie("font size", fs, {
        maxAge: 1000*60*60*24*365
    })
    res.redirect("/")
})
app.listen(3000, function(){
    console.log("Live at port 3000")
})