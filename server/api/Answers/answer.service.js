const pool = require("../../config/database");

module.exports = {
  // ///formula for insreting it...will be excuted on answer.contoller when it passes all the critereas
  Answer: (data, callback) => {
    pool.query(
      `INSERT INTO answer (answer, answer_code_block, user_id, question_id) VALUES (?, ?, ?, ?)`,
      [data.answerDescription, data.answerCode, data.userId, data.questionId],

      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  },

  getAnswers: (questionId, callback) => {
    pool.query(
      `
  SELECT
    answer.answer_id,
    answer.answer,
    registration.user_name
  FROM
    answer 
  JOIN
    registration ON answer.user_id = registration.user_id
  WHERE
    answer.question_id = ?;
  `,
      [questionId],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  },
};
