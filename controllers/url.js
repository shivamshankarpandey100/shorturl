const shortid=require('shortid');
const URL=require('../models/url');


async function handleGenrateNewShortUrl(req,res){
    const body=req.body;

    if(!body.url){
         return res.status(400).json({message:"URL is required"});
    }
     const shortID=shortid();
        await URL.create({
            shortId:shortID,
            redirectUrl:body.url,
            visitHistory:[],
     });

     return res.status(200).json({id:shortID});
}


async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result=await URL.findOne({shortId});

    return res.status(200).json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    });
}


module.exports={
    handleGenrateNewShortUrl,
    handleGetAnalytics,
}