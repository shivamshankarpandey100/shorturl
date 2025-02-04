const express=require("express");
const urlRoute=require('./routes/url');
const URL=require('./models/url')
const {connectToMongoDB}=require('./connection');
const path=require('path');
const { url } = require("inspector");


const app=express();
const PORT=8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(()=>{
    console.log("Database connected");
})

app.set('view Engine','ejs');
app.set('views',path.resolve("./views"))

app.use(express.json());

app.get('/test',async(req,res)=>{
    const allURLs=await URL.find({});
    return res.render('home.ejs',{
        urls:allURLs,
    });
})

app.use('/url',urlRoute);

app.get('/url/:shortId',async (req,res)=>{
    const shortId=req.params.shortId;
  const entry=  await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory:{
                timeStamp:Date.now()
            }
        }
    });
    return res.redirect(entry.redirectUrl);
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
}) 