const express = require("express");
const authMiddleware = require("../Middleware/Auth");
const router = express.Router();

router.get("/AllDept", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM department";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("AllDept", { departments: rows });
  });
});

router.get("/AddDept", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM department";
    let query = connection.query(sql, (err, results) => {
      if (err) throw err; 

      res.render("AddDept", { depts: results });
    });
});

router.post("/AddDept", authMiddleware, (req, res) => {
  let data = req.body;
  let sql = "INSERT INTO department SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/AllDept");
  });
});

router.get("/EditDept/:id", authMiddleware, (req, res) => {
  let id = req.params.id;
  let sql = "SELECT * FROM department WHERE id = ?";
  let query = connection.query(sql, id, (err, results) => {
    if (err) throw err;
    res.render("EditDept", { dept: results[0] });
  });
});

router.post("/EditDept/:id", authMiddleware, (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let sql = "UPDATE department SET ? WHERE id = ?";
  let query = connection.query(sql, [data, id], (err, results) => {
    if (err) throw err;
    res.redirect("/AllDept");
  });
});

router.get("/deleteDept/:id", authMiddleware, (req, res) => {
  let id = req.params.id;
  let sql = "DELETE FROM department WHERE id=?";
  let query = connection.query(sql, id, (err, results) => {
    if (err) throw err;
    res.redirect("/AllDept");
  });
});

module.exports = router;
