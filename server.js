require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
const userRouter = require("./server/api/users/user.router");
const questionRouter = require("./server/api/Questions/question.router");
const answerRouter = require("./server/api/Answers/answer.router");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/questions", questionRouter);
app.use("/api/answer", answerRouter);

app.listen(port, () => console.log(`listening to http://localhost:${port}`));
