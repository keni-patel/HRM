const express = require("express");
const authMiddleware = require("../Middleware/Auth");
const router = express.Router();
const moment = require("moment");

router.get("/todayattend", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM attendance where date = current_date";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("todayattend", {
      users: rows,
    });
  });
});

router.get("/addattend", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM employee";
  let attendFlash = req.flash("attendFlashMsg");
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.render("addattend", { employees: results, attendFlash });
  });
});

router.post("/addattend", authMiddleware, (req, res) => {
  let data = req.body;
  let emp_id = req.body.attend_emp_id;
  let date = new Date();
  let formattedDate = moment(date).format("YYYY-MM-DD");
  let sql = "SELECT * FROM attendance WHERE attend_emp_id = ? AND date = ?";
  let query = connection.query(sql, [emp_id, formattedDate], (err, results) => {
    if (err) throw err;

    if (results != "") {
      req.flash("attendFlashMsg", "Attendance already done.");
      res.redirect("addattend");
    } else {
      let sql = "INSERT INTO attendance SET ?";
      let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect("todayattend");
      });
    }
  });
});

router.get("/empattend/:emp_id", authMiddleware, (req, res) => {
  const userId = req.params.emp_id;
  let sql = `SELECT * FROM employee e, attendance a WHERE e.id = ${userId} AND a.attend_emp_id=${userId};
  SELECT COUNT(attend_emp_id) AS present FROM attendance WHERE attend_emp_id = ${userId} AND status="Present" AND date BETWEEN "2022-04-01" AND "2022-05-30";
  SELECT COUNT(attend_emp_id) AS absent FROM attendance WHERE attend_emp_id = ${userId} AND status="Absent" AND date BETWEEN "2022-02-01" AND "2022-05-30"`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("empattend", {
      users: result[0],
      present: result[1],
      absent: result[2],
    });
  });
});

router.get("/Editattend/:emp_id", authMiddleware, (req, res) => {
  const userId = req.params.emp_id;
  let sql = `Select * from attendance where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("Editattend", {
      user: result[0],
    });
  });
});

router.post("/Editattend/:emp_id", authMiddleware, (req, res) => {
  const userId = req.params.emp_id;
  const data = req.body;

  let sql = `update attendance SET ? where id= ${userId}`;

  let query = connection.query(sql, [data, userId], (err, results) => {
    if (err) throw err;
    res.redirect("/todayattend");
  });
});

router.get("/deleteattend/:emp_id", authMiddleware, (req, res) => {
  const userId = req.params.emp_id;
  let sql = `DELETE from attendance where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/todayattend");
  });
});

module.exports = router;
