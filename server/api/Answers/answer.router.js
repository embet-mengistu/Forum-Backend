const router = require("express").Router();

const auth = require("../middleware/auth");

const { postAnswer, getAllAnswers } = require("./answer.controller");

router.post("/postanswer", auth, postAnswer);
router.get("/:questionId", getAllAnswers);

module.exports = router;
