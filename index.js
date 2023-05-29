const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const Cookiesession = require('cookie-session');


require("dotenv").config({path : "./config/.env"})
require("./config/db")

const {checkUser, requireAuth} = require("./middleware/auth.middleware")


const documentRoutes = require("./routes/documents.routes")
const userRoutes = require("./routes/user.routes")

const cors = require("cors")


const app = express();


const corsOptions = {
    origin : [process.env.CLIENT_URL, process.env.CLIENT_URR_2],
    credentials : true,
    "allowedHeaders":["sessionId", "Content-Type"],
    "exposedHeaders" : ["sessionId"],
    "methods":"GET, HEAD, PUT, PATCH, POST, DELETE",
    "preflightContinue" : false
}
app.use(cors(corsOptions));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended :true}))
app.use(cookieParser())
app.use(
    Cookiesession({
      secret: process.env.TOKEN_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 300000,
        secure: true, // Set to true if using HTTPS
        httpOnly: true, // Restrict access to the cookie only via HTTP(S)
        domain: 'salleslibresv2.netlify.app', // Set the correct domain for your deployment
        path: '/', // Set the correct path for your deployment
      },
    })
  );
  
app.use(fileUpload())

//jwt
app.get("*", checkUser)
app.get("/jwtid", requireAuth, (req, res)=>{
    res.status(200).send(res.locals.user._id)
})

//routes
app.use("/api/document", documentRoutes)
app.use("/api/user", userRoutes)


app.listen(process.env.PORT, ()=>{
    console.log(`Listening on port ${process.env.PORT}`)
})
