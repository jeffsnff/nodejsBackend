const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressJwt = require('express-jwt')
const PORT = process.env.PORT || 7000;
const cors = require('cors')



app.use(express.json());
app.use(morgan('dev'));
app.use(cors())


mongoose.connect("mongodb://localhost:27017/redditish", {
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
// if any request hits /api ( /api/whatever ) it requires a token
app.use('/api', expressJwt({secret: process.env.SECRET}))
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