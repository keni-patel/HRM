const express = require("express");
const authMiddleware = require("../Middleware/Auth");
const router = express.Router();

router.get("/AllProject", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM project";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("AllProject", {
      projects: rows,
    });
  });
});

router.get("/AddProject", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM project";
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;

    res.render("AddProject");
  });
});

router.post("/AddProject", authMiddleware, (req, res) => {
  let data = req.body;
  if (req.files) {
    const file = req.files.project_docs;
    const path = `./static/upload/${file.name}`;

    file.mv(path, (err) => {
      if (err) throw err;
    });
    data.project_docs = file.name;
  }
  let sql = "INSERT INTO project SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/AllProject");
  });
});

router.get("/EditProject/:userId", authMiddleware, (req, res) => {
  const userId = req.params.userId;
  let sql = `Select * from project where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("EditProject", {
      project: result[0],
    });
  });
});

router.post("/EditProject/:id", authMiddleware, (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  if (req.files) {
    const file = req.files.project_docs;
    const path = `./static/upload/${file.name}`;

    file.mv(path, (err) => {
      if (err) throw err;
    });
    data.project_docs = file.name;
  }
  let sql = `update project SET ? where id=?`;
  let query = connection.query(sql, [data, userId], (err, results) => {
    if (err) throw err;
    res.redirect("/AllProject");
  });
});

router.get("/deleteProject/:userId", authMiddleware, (req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from project where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/AllProject");
  });
});

module.exports = router;
