const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

//ALL post request needs to be ASYNC
router.post("/", async (req, res) => {
  const { userName, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      userName: userName,
      password: hash,
    });
  });
  res.json("success");
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassworld, newPassword } = req.body;
  const user = await Users.findOne({
    where: {
      userName: req.user.userName,
    },
  });

  bcrypt.compare(oldPassworld, user.password).then((match) => {
    if (!match) return res.json({ error: "Wrong password combination" });
    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        {
          password: hash,
        },
        { where: { userName: req.user.userName } }
      );
    });
  });
});
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const user = await Users.findOne({
    where: {
      userName: userName,
    },
  });
  if (!user) {
    res.json({ error: "user doesnt exist" });
  } else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match)
        return res.json({ error: "Wrong username and password combination" });
      const accessToken = sign(
        { userName: user.userName, id: user.id },
        "importantsecret"
      );

      res.json({ accessToken: accessToken, userName: userName, id: user.id });
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:uId", async (req, res) => {
  const uId = req.params.uId;
  const basicInfo = await Users.findByPk(uId, {
    attributes: { exclude: ["password"] },
  });
  res.json(basicInfo);
});

module.exports = router;
