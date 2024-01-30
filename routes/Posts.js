const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  console.log("fuck");
  const listofPosts = await Posts.findAll({ include: [Likes] });
  if (req.user) {
    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
    return res.json({ listofPosts: listofPosts, likedPosts: likedPosts });
  } else {
    const likedPosts = [];
    return res.json({ listofPosts: listofPosts, likedPosts: likedPosts });
  }
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byUserId/:uId", async (req, res) => {
  const uId = req.params.uId;
  const postss = await Posts.findAll({where:{UserId: uId}, include:[Likes] });
  res.json(postss);
});


//ALL post request needs to be ASYNC
router.post("/", validateToken, async (req, res) => {
  try {
    const post = req.body;
    post.userName = req.user.userName;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:pId", validateToken, async (req, res) => {
  const pId = req.params.pId;
  //    console.log("trig");
  await Posts.destroy({
    where: {
      id: pId,
    },
  });

  res.json("deleted !");
});

router.put("/title", validateToken, async (req, res) => {
  try {
    const {newTitle, id} = req.body;

    await Posts.update({title: newTitle},{where:{id:id}})
    res.json(newTitle);
  } catch (error) {
    console.log(error);
  }
});

router.put("/postText", validateToken, async (req, res) => {
  try {
    const {newText, id} = req.body;

    await Posts.update({postText: newText},{where:{id:id}})
    res.json(newText);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
