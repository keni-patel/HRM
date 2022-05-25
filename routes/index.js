const express = require("express");
const authMiddleware = require("../Middleware/Auth");
const router = express.Router();

router.get("/index", authMiddleware, (req, res) => {
  const email = req.session.email;
    let sql = `SELECT * FROM employee; SELECT * FROM signup WHERE email= ?`;
    let query = connection.query(sql, email, (err, rows) => {
      if (err) throw err;
      res.render("index", {
        users: rows[0],
        profile: rows[1],
      });
    });
  // res.render("index")
});

router.get("/Profile", authMiddleware, (req, res) => {
  const email = req.session.email;
  let sql = `SELECT * FROM signup WHERE email = ?`;
  let query = connection.query(sql, email, (err, results) => {
    if (err) throw err;
    res.render("EditProfile", {
      profile: results[0],
    });
  });
});

router.post("/Profile", authMiddleware, (req, res) => {
    let data = req.body;
    let email = req.session.email;
    if (req.files) {
      const file = req.files.profilephoto;
      const path = `./static/upload/${file.name}`;

      file.mv(path, (err) => {
        if (err) throw err;
      });
      data.profilephoto = file.name;
    }
    let sql = "UPDATE signup SET ? WHERE email = ?";
    let query = connection.query(sql, [data, email], (err, results) => {
      if (err) throw err;

      res.redirect("/Profile");
    });
});

module.exports = router;
