const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressJwt = require('express-jwt')
const PORT = process.env.PORT || 7000;
const SECRET = process.env.SECRET || "yolo brokenman bleeding heraticmenow"
const cors = require('cors')


app.use(express.json());
app.use(morgan('dev'));
// app.use(cors())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/redditish", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => console.log('Connected to the Database'));


// Routes
// app.use('/', (req, res) => {
//   res.send("Hello World")
// })
app.use('/auth', require('./routes/authRouter.js'));

app.use('/beta', require('./routes/userRouter.js'));
// if any request hits /api ( /api/whatever ) it requires a token
app.use('/api', expressJwt({secret: SECRET }))
app.use('/api/post', require('./routes/postRouter.js'))

// Error Handling
app.use((err, req, res, next) => {
    console.log(err);
    if(err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message});
});


app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`));