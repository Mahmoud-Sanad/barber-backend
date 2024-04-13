const express = require("express");
const app = express();
const cors = require("cors");
const errorController = require("./controllers/errorController");
const authRouter = require('./routers/authRouter');
const packageRouter = require('./routers/packageRouter');
const barberRouter = require('./routers/barberRouter');

app.use(express.json());

app.use(cors());

app.use('/api/auth' ,authRouter );
app.use('/api/packages',packageRouter);
app.use("/api/barbers",barberRouter);
app.all("*",(req,res,next)=>{
    res.status(404).json({
        message: "wrong URL",
    });
});
app.use(errorController);
module.exports=app;