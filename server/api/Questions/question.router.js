const router = require("express").Router();

const auth = require("../middleware/auth");

const {
  postQuestion,
  getQuestions,
  getPosts,
} = require("./question.controller");

// ///needs auth so that theycan access the req.id
router.post("/ask", auth, postQuestion);
router.get("/ask", auth, getQuestions);
router.get("/", auth, getPosts);

module.exports = router;
