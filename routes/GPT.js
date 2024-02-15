const { OpenAI } = require("openai");
const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const { ChatMessages } = require("../models");
require("dotenv").config();
const strftime = require("strftime");
const { Chats } = require("../models/");

const callGpt35 = async (prompt) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_SECRET_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'I want to learn basic chinese. When I type a prompt, please reply with chinese version of that sentence (basic, easy, intro-level vocab). And in the next sentence, please put pronunciations of the sentences in a paranthesis. And in the next sentence, please put meaning of each word in the following form: [["chinese word","english meaning in the context of the given sentece","pronunciation"], ... (repeat)] Please make the sentences into json formatt in a following way: {"chineseV": "your chinese sentece", "pronunciation": "your pronunciation", "words": your array}. Your text must be in json format that I specified.',
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    // console.log();
    console.log(chatCompletion.choices[0].message);
    return chatCompletion.choices[0].message;
  } catch (error) {
    console.error("callGpt35() error >>> ", error);
    return null;
  }
};

router.get("/", validateToken, async (req, res) => {
  //   res.send("respond with a resource");
  console.log("get /gpt/");
  if (!req.user) {
    return res.json({ error: "get /gpt/ not logged in error" });
  }
  const listOfChats = await Chats.findAll({
    include: [{ model: ChatMessages, where: { UserId: req.user.id } }],
    where: { UserId: req.user.id },
  });
  console.log(listOfChats);
  res.json({ res: listOfChats });
});

router.post("/chat", validateToken, async (req, res) => {
  const prompt = req.body.userPrompt;
  var chatCreated = {};
  if (req.body.add) {
    chatCreated = await Chats.create({
      id: req.body.idNum,
      UserId: req.user.id,
      timestamp: strftime("%F %T", new Date()),
    });
  }
  const response = await callGpt35(prompt);

  const cId = req.body.add ? chatCreated.id : req.body.ChatId;

  try {
    const content = JSON.parse(response.content);
    if (content.error){
      console.log("server gpt error")
      return  res.json(response.content);
    }

    await ChatMessages.create({
      UserId: req.user.id,
      ChatId: cId,
      message: prompt,
      timestamp: strftime("%F %T", new Date()),
    });
    await ChatMessages.create({
      UserId: req.user.id,
      ChatId: cId,
      message: response.content,
      timestamp: strftime("%F %T", new Date()),
    });

    return res.json(response.content);
  } catch (e) {
    console.log("errorerrorrrrro dsrver pt")
    res.json({ error: "Invalid Input or Something Went Wrong" });
  }
});

module.exports = router;
