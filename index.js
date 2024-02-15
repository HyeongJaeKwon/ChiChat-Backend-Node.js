const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
//it was something like interpreting html

app.use(express.json());
app.use(cors());

const db = require("./models");

//Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentRouter = require("./routes/Comments");
app.use("/comments", commentRouter);
const userRouter = require("./routes/Users");
app.use("/auth", userRouter);
const likeRouter = require("./routes/Likes");
app.use("/like", likeRouter);
const gptRouter = require("./routes/GPT");
app.use("/gpt", gptRouter);
const addRouter = require("./routes/Added");
app.use("/add", addRouter);

db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("Server running on port 3001");
    });
  })
  .catch((err) => {
    console.log("erroreee: ", err);
  });
