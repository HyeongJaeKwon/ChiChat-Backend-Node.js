const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware")

router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({where:{
        PostId: postId
    }});
    res.json(comments);
  });

router.post('/', validateToken, async (req,res)=>{
    const comment = req.body
    const un = req.user.userName;
    comment.userName = un;
    const obj = await Comments.create(comment);
    // console.log(obj)
    res.json(obj);
})

router.delete("/:commentId", validateToken, async (req,res)=>{
    const cId = req.params.commentId;

//    console.log("trig");
    await Comments.destroy({where:{
        id: cId
    }})

    res.json("deleted !")
})
module.exports = router;