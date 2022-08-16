const express = require('express')
const expressLayouts =  require('express-ejs-layouts')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')
// const bodyParser = require('body-parser')
// const nodemailer = require('nodemailer')

const app = express()
const port = 3000

require('dotenv').config()
const db = require('./server/models/database')

app.use(express.urlencoded( {extended:true} ))
app.use(express.static('public'))
app.use(expressLayouts)
app.use('/favicon.ico', express.static('/public/img/favicon.ico'));

//
// let mongoStore = new MongoDbStore({
//     mongooseConnection: db,
//     colletion: 'sessions'
// })
//sesije
app.use(cookieParser('MojaKuhinjaSecure'))
app.use(session({
    secret:'tajnikljuc',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:process.env.MONGODB_URI,
    }),
    cookie:{maxAge: 180 * 60 * 1000}
    // secret: 'MojaKuhinjaKljuc',
    // saveUninitialized:false,
    // resave: false,
    // // store: mongoStore,
    // cookie: {maxAge:1000 * 60 * 60 * 12}
}))

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
})

app.use(flash())
app.use(fileUpload())
// 
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

const routes = require('./server/routes/mkRoutes.js')
const { connection, default: mongoose } = require('mongoose')
// const { db } = require('./server/models/kategorije.js')
app.use('/', routes)
// 

// 404 - 
app.use(function(req,res){
    
    res.status(404).render('404', {title:'Greska - 404'})
})

app.listen(port, ()=>{
    console.log(`listen on port ${port}`);
})