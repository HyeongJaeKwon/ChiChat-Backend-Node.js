const express = require("express");
const router = express.Router();
const { Adds , Posts} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware")


router.post('/', validateToken, async(req,res)=>{
    const {PostId} = req.body;
    const uId = req.user.id; 
    
    const found = await Adds.findOne({where: {PostId: PostId, UserId: uId}})
    if (!found)
        {await Adds.create({PostId: PostId, UserId: uId });
    return res.json({added: true})}
    else
       { await Adds.destroy({where: {PostId: PostId, UserId: uId}});
    return res.json({added: false})}
    
})

router.get('/', validateToken, async(req,res)=>{
    const found = await Adds.findAll({where: {UserId: req.user.id}})
    const arr = await Promise.all(
        found.map(async (each) => {
          const s = await Posts.findByPk(each.PostId);
          return s;
        })
      );
    return res.json({addedList: arr})
})

module.exports = router;