const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const transporter = require("../mailer/nodemailer");
let otp;
let forgotEmail;
router.get("/login", (req, res) => {
  const username = req.flash("message");
  res.render("login", { username });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(function (err) {
      if (!err) {
        res.redirect("/login");
      }
    });
  }
});

router.post("/signup", function (req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmpass = req.body.confirmpass;
  if (username && email && password && confirmpass) {
    let sql = "SELECT email FROM signup WHERE email = ?";
    let query = connection.query(sql, [email], (err, result) => {
      if (err) throw err;
      let newEmail = result.length ? result[0].email : null;
      if (email !== newEmail) {
        if (confirmpass != password) {
          req.flash("message", "Password doesn't match");
          res.redirect("/login");
        } else {
          //Encrypted the password
          let hashpassword = bcrypt.hashSync(password, 10);
          let sql =
            "INSERT INTO signup(username, email, password) values(?,?,?)";
          let query = connection.query(
            sql,
            [username, email, hashpassword],
            (err, results) => {
              if (err) throw err;
              req.flash("message", "User Registered!");
              res.redirect("/login");
            }
          );
        }
      } else {
        req.flash("message", "Email exist");
        res.redirect("/login");
      }
    });
  } else {
    req.flash("message", "Enter fields properly");
    res.redirect("/login");
  }
});

router.post("/login", function (req, res) {
  let data = req.body;
  if (data.email && data.password) {
    sql = "SELECT * FROM signup WHERE email = ?";
    connection.query(sql, [data.email], function (error, results) {
      if (error) throw error;

      //comparing the encrypted password
      if (
        results.length &&
        bcrypt.compareSync(data.password, results[0].password)
      ) {
        req.session.email = req.body.email;
        req.session.password = req.body.password;
        res.redirect("/index");
      } else {
        req.flash("message", "Incorrect Username or Password");
        res.redirect("/login");
      }
    });
  } else {
    req.flash("message", "Enter fields properly");
    res.redirect("/login");
  }
});

router.get("/ForgotPassword", (req, res) => {
  let forgotFlash = req.flash("forgotEmailFlash");
  res.render("ForgotPassword", { forgotFlash });
});

router.post("/ForgotPassword", (req, res) => {
  const { email } = req.body;

  forgotEmail = email;
  let sql = "SELECT email FROM signup WHERE email=?";
  let query = connection.query(sql, forgotEmail, (err, results) => {
    if (err) throw err;
    let newEmail = results.length ? results[0].email : null;
    if (forgotEmail == newEmail) {
      otp = Math.floor(Math.random() * 899999 + 100000);
      console.log(otp);

      let mailOptions = {
        from: "motacharodiya70@gmail.com",
        to: `${email}`,
        subject: "Reset Password @HimalayaInfotech",
        text: `Your password is here: ${otp}`,
        html: `<h3>Your OTP to reset password is here:</h3><h2 style="color: red; text-decoration: underline">${otp}</h2>`,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) throw err;
        console.log("Email Sent");
      });
      res.redirect("/otp");
    } else {
      req.flash("forgotEmailFlash", "Email not exist!");
      res.redirect("/ForgotPassword");
    }
  });
});

router.get("/otp", (req, res) => {
  let otpFlash = req.flash("otpflash");
  res.render("otp", { otpFlash });
});

router.post("/otp", (req, res) => {
  const inputOTP = req.body.otp;
  if (otp == inputOTP) {
    res.redirect("SetNewPassword");
  } else {
    req.flash("otpflash", "Incorrect OTP");
    res.redirect("/otp");
  }
});

router.get("/SetNewPassword", (req, res) => {
  const forgotPassFlash = req.flash("passFlash");
  res.render("SetNewPassword", { forgotPassFlash });
});

router.post("/SetNewPassword", (req, res) => {
  let { password, confirmPassword } = req.body;

  if (password == confirmPassword) {
    let hashpassword = bcrypt.hashSync(password, 10);

    let sql = "UPDATE signup SET password=? WHERE email = ?";
    let query = connection.query(
      sql,
      [hashpassword, forgotEmail],
      (err, results) => {
        if (err) throw err;
        res.redirect("/login");
      }
    );
  } else {
    req.flash("passFlash", "Password not matched!");
    res.redirect("/SetNewPassword");
  }
});

router.get("/", function (req, res) {
  if (req.session.email && req.session.password) {
    res.redirect("/index");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
