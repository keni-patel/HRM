const express = require("express");
const authMiddleware = require("../Middleware/Auth");
const router = express.Router();

router.get("/AllLeaveRequest", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM leaverequest";
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("AllLeaveRequest", { leaves: rows });
  });
});

router.get("/NewLeaveRequest", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM employee";
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;

    res.render("NewLeaveRequest", { employees: results });
  });
});

router.post("/NewLeaveRequest", authMiddleware, (req, res) => {
  const data = req.body;
  const sql = "INSERT INTO leaverequest SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/AllLeaveRequest");
  });
});

router.get("/EditLeaveRequest/:id", authMiddleware, (req, res) => {
  let id = req.params.id;
  let sql = "SELECT * FROM leaverequest WHERE id = ?";
  let query = connection.query(sql, id, (err, rows) => {
    if (err) throw err;
    res.render("EditLeaveRequest", { leave: rows[0] });
  });
});

router.post("/EditLeaveRequest/:id", authMiddleware, (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let sql = "UPDATE leaverequest SET ? WHERE id=?";
  let query = connection.query(sql, [data, id], (err, results) => {
    if (err) throw err;
    res.redirect("/AllLeaveRequest");
  });
});

router.get("/deleteLeaveRequest/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  let sql = `DELETE FROM leaverequest WHERE id = ?`;
  let query = connection.query(sql, id, (err, result) => {
    if (err) throw err;
    res.redirect("/AllLeaveRequest");
  });
});

router.post("/updateLeave/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = `UPDATE leaverequest SET status=? WHERE id = ?; SELECT leave_emp_id FROM leaverequest WHERE id = ?`;
  const query = connection.query(sql, [data.status, id, id], (err, rows) => {
    if (err) throw err;
    let id = rows[1];
    let sql = `SELECT COUNT(leave_emp_id) as total FROM leaverequest WHERE leave_emp_id = ? AND status = "Approved"; SELECT * FROM employee WHERE id = ?`;
    let query = connection.query(
      sql,
      [id[0].leave_emp_id, id[0].leave_emp_id],
      (err, results) => {
        if (err) throw err;

        let countApprovedLeave = results[0];
        let emp_leave_data = results[1];
        const calculate_leave_approved =
          0 + countApprovedLeave[0].total;
        const calculate_leave_balanced =
          15 - countApprovedLeave[0].total;

        let sql = `UPDATE employee SET leave_approved = ?,leave_balanced = ? WHERE id = ? `;
        let query = connection.query(
          sql,
          [
            calculate_leave_approved,
            calculate_leave_balanced,
            emp_leave_data[0].id,
          ],
          (err, results) => {
            if (err) throw err;
          }
        );
      }
    );
    res.redirect("/AllLeaveRequest");
  });
});

router.get("/LeaveBalance", authMiddleware, (req, res) => {
  let sql = "SELECT * FROM employee";
  let query = connection.query(sql, (err, rows) => {
    res.render("LeaveBalance", { employees: rows });
  });
});

module.exports = router;
