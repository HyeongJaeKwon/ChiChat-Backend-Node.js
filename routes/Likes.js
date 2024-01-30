const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware")


router.post('/', validateToken, async(req,res)=>{
    const {PostId} = req.body;
    const uId = req.user.id; 
    
    const found = await Likes.findOne({where: {PostId: PostId, UserId: uId}})
    if (!found)
        {await Likes.create({PostId: PostId, UserId: uId });
    return res.json({liked: true})}
    else
       { await Likes.destroy({where: {PostId: PostId, UserId: uId}});
    return res.json({liked: false})}
    
})

module.exports = router;