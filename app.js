const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const ejs = require("ejs");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const moment = require("moment");
const flash = require("connect-flash");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

//Database Connection..
connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hr",
  multipleStatements: true,
});

connection.connect(function (error) {
  if (error) console.log(error);
  else console.log("Database Connected!");
});

//Creating session db
var sessionStore = new MySQLStore(
  {
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
      tableName: "sessiondb",
      columnNames: {
        session_id: "sesssion_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  connection
);

//session generation
app.use(
  session({
    key: "keyin",
    secret: "my secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.session = req.session;

  next();
});

// set static path
app.use(express.static("static"));

//set view engine
app.set("view engine", "ejs");

//body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use((req, res, next) => {
  if (req.session.email) {
    let email = req.session.email;
    let sql = `SELECT * FROM signup WHERE email = ?`;
    let query = connection.query(sql, email, (err, results) => {
      if (err) throw err;
      res.locals.loginUser = results[0];
    });
  }
  next();
});

//Routes
const loginroute = require("./routes/login");
const dashroute = require("./routes/index");
const emproute = require("./routes/employee");
const projroute = require("./routes/project");
const deptroute = require("./routes/department");
const leaveroute = require("./routes/leaverequest");
const attend = require("./routes/attend");



app.use("/", loginroute);
app.use(leaveroute);
app.use(deptroute);
app.use(dashroute);
app.use(emproute);
app.use(projroute);
app.use(attend);


// Server Listening
app.listen(5000, () => {
  console.log(`Server running at port 5000`);
});


module.exports = app