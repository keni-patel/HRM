const express = require("express");
const authMiddleware = require("../Middleware/Auth");
const router = express.Router();

router.get("/AllEmployee", authMiddleware, (req, res) => {
    let sql = "SELECT * FROM employee";
    let query = connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.render("AllEmployee", {
        users: rows,
      });
    });
});

router.get("/AddEmployee", authMiddleware, (req, res) => {
    let sql = "SELECT * FROM department";
    let query = connection.query(sql, (err, results) => {
      if (err) throw err;

      res.render("AddEmployee", { depts: results });
    });
});

router.post("/AddEmployee", authMiddleware, (req, res) => {
    let data = req.body;

    //Upload image files in the static folder
    if (req.files) {
      const file = req.files.profilephoto;
      const path = `./static/upload/${file.name}`;

      file.mv(path, (err) => {
        if (err) throw err;
      });
      data.profilephoto = file.name;
    }
    let sql = "INSERT INTO employee SET ?";
    let query = connection.query(sql, data, (err, results) => {
      if (err) throw err;
      res.redirect("/AllEmployee");
    });
});

router.get("/EditEmployee/:id", authMiddleware, (req, res) => {
    const userId = req.params.id;
    let sql = `Select * from employee where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render("EditEmployee", {
        user: result[0],
      });
    });
});

router.post("/EditEmployee/:id", authMiddleware, (req, res) => {
    const userId = req.params.id;
    const data = req.body;
    if (req.files) {
      const file = req.files.profilephoto;
      const path = `./static/upload/${file.name}`;

      file.mv(path, (err) => {
        if (err) throw err;
      });
      data.profilephoto = file.name;
    }
    let sql = `update employee SET ? where id=?`;

    let query = connection.query(sql, [data, userId], (err, results) => {
      if (err) throw err;
      res.redirect("/AllEmployee");
    });
});

router.get("/deleteEmployee/:userId", authMiddleware, (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from employee where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect("/AllEmployee");
    });
});

module.exports = router;
