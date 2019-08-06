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
    name: "cookie",
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
        res.render("home.html",{
            username: req.session.username,
            fontsize: fs
        })
    }else{
        res.sendFile(__dirname + "/public/login.html")
    }
})




app.post("/additem", urlencoder, (req,res)=>{
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




app.post("/login", urlencoder, (req,res)=>{
    console.log(doc)
    req.session.username = doc.username
    res.redirect("/")
})

app.post("/signup", urlencoder, (req, res)=>{
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
app.listen(3000, function(){
    console.log("Live at port 3000")
})