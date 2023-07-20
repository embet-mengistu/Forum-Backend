const pool = require("../../config/database");
require("dotenv").config();
const { Question, getQuestion, getPost } = require("./question.service");

module.exports = {
  postQuestion: (req, res) => {
    const { questionTitle, questionDescription } = req.body;
    // /////generating post_id which is unique id for all

    const generateUniqueId = () => {
      const timestamp = new Date().getTime().toString(36);
      const randomString = Math.random().toString(36).substring(2, 15);
      return timestamp + randomString;
    };

    if (!questionTitle && !questionDescription) {
      return res.status(400).json({ msg: "Nothing has been provided" });
    }
    if (!questionTitle) {
      return res.status(400).json({ msg: "Please provide title" });
    }
    // ///////req.id came from auth...so when inorder to post a question auth is needed that means(so we are passing it as it came from frontend(req.body))//////and also passing the postId as it came from frontend
    req.body.userId = req.id;
    req.body.postId = generateUniqueId();
    // then when it passes all the criterias it posts the questions
    Question(req.body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Database connection error" });
      }
      return res.status(200).json({
        msg: "New question added successfully",
        data: results,
      });
    });
  },
  // ////trying to get all the questions
  getQuestions: (req, res) => {
    getQuestion((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "questions not found" });
      }
      return res.status(200).json({ data: results });
    });
  },

  getPosts: (req, res) => {
    getPost((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "questions not found" });
      }
      return res.status(200).json({ data: results });
    });
  },
};
