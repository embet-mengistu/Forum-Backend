const {
  register,
  getAllUsers,
  getUserByEmail,
  userById,
  profile,
} = require("./user.service");

const pool = require("../../config/database");
const bcrypt = require("bcryptjs");
// const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  createUser: (req, res) => {
    const { userName, email, password, firstName, lastName } = req.body;

    console.log(req.body);
    if (!userName || !firstName || !lastName || !email || !password)
      return res.status(400).json({ msg: "Not all fields have been provided" });
    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be atleast 8 characters" });
    //////beti zehabo email and username select geberlena ena neblo zalena and check it
    pool.query(
      `
     SELECT * FROM registration WHERE user_email = ? OR user_name = ?`,
      [email, userName],
      (err, results) => {
        if (err) {
          return res.status(err).json({ msg: "database connection err" });
        }
        if (results.length > 0) {
          return res.status(400).json({
            msg: "An account with this email or user Name already exists!",
          });
        } else {
          // //////////encrypting the password which came from frontend///////
          const salt = bcrypt.genSaltSync();
          req.body.password = bcrypt.hashSync(password, salt);

          register(req.body, (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ msg: "database connection err" });
            }
            pool.query(
              "SELECT * FROM registration WHERE user_email = ?",
              [email],
              (err, results) => {
                if (err) {
                  return res
                    .status(err)
                    .json({ msg: "database connection err" });
                }
                // passing the user_id when they register(we grab the user_id when they register and pass it profile user_id as it came from frontend(bc we said tht it is gonna come from frontend in user service))
                req.body.userId = results[0].user_id;
                console.log(req.body);

                profile(req.body, (err, results) => {
                  if (err) {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ msg: "database connection err" });
                  }
                  return res.status(200).json({
                    msg: "New user added successfully",
                    data: results,
                  });
                });
              }
            );
          });
        }
      }
    );
  },
  getUsers: (req, res) => {
    getAllUsers((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "database connection err" });
      }
      return res.status(200).json({ data: results });
    });
  },
  // req.id comes from auth(so we can get req.id only when we sign in or login)
  getUserById: (req, res) => {
    userById(req.id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Record not found" });
      }
      return res.status(200).json({ data: results });
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fileds have been provided" });
    getUserByEmail(email, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "database connection err" });
      }
      if (!results) {
        return res
          .status(404)
          .json({ msg: "No account with this email has been registered" });
      }

      // comparing password from frontend and the encrypted on from database
      const isMatch = bcrypt.compareSync(password, results.user_password);

      if (!isMatch) return res.status(404).json({ msg: "Invalid Credentials" });
      // ///////////////////when its passes all the criterias then we encrypt the user_id from the results(the results come from when they login we selcect it by its email and we get all the info and we encrypt the userId)////////
      const token = jwt.sign({ id: results.user_id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // so once looged in pass me those in below(since we selected it by its email when they log in we can access the username userid etcc from the results)
      return res.json({
        token,
        user: {
          id: results.user_id,
          display_name: results.user_name,
        },
      });
    });
  },
};
