const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000; // -- 처음에 할땐 3000이라고 하고 한 후
//localhost:3000 으로 하시는 것을 추천
//나중에 80포트를 써야 할 일이 옵니다.
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

server.listen(8000, () => {
  console.log("listening on *:8000");
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use("/static", express.static("public"));

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.listen(port, () => console.log(`Server up and running on port ${port}.`));

// require('./routes/auth.routes')(app);
require("./routes/googleform.routes")(app);

const db = require("./models");
const User = db.User;
const GoogleForm = db.GoogleForm;
const FormQuestion = db.formQuestion;
const Option = db.Option;
const Answer = db.Answer;

app.get("/", (req, res) => {
  console.log("---");
  res.json({ message: "Welcome to our application." });
});

/*실행 안됨*/
app.post("/image/get", async (req, res) => {
  const url = "https://www.ringleplus.com";
  res.json(url);
});

app.get("/products/:id", cors(), function (req, res, next) {
  res.json({ msg: `This is CORS-enabled for a Single Route ${req.params.id}` });
});

/*실행 안됨*/
app.post("/image/get", async (req, res) => {
  // res.json({ message: "good morning" });
  console.log(req.body);
  const url = "https://www.ringleplus.com";
  res.json({
    url: url,
    bodyContent2: 1,
    bodyContent: req.body.formId,
  });
});

app.get("/users/createPractice", async (req, res) => {
  const userList = await User.create({
    firstName: "HG",
    lastName: "Kim",
  });

  return res.json({
    userList: userList,
    message: `user${userList.id} is created`,
  });
});

app.get("/users/:id", async (req, res) => {
  const userList = await User.findOne({
    where: { id: parseInt(req.params.id) },
  });

  return res.json({ userList: userList, message: "fetched" });
});

app.get("/formQuestion/all", async (req, res) => {
  const formQuestions = await FormQuestion.findAll({});
  res.json({ formQuestions: formQuestions });
});

app.post("/users/create", async (req, res) => {
  const data = req.body;
  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: bcrypt.hashSync(data.password, 8),
  });
  res.json({ success: true });
});

app.post("/users/login", async (req, res) => {
  const data = req.body;
  console.log(data);
  const user = await User.findOne({ where: { email: data.email } });

  if (user) {
    console.log(user);
    console.log("success!!");
    var passwordIsValid = bcrypt.compareSync(data.password, user.password);
    if (passwordIsValid) {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      });
      res.json({
        success: true,
        token: token,
      });
    } else {
      res.json({
        success: false,
        reason: "wrong password",
      });
    }
  } else {
    console.log("There is not an owner of the email. ");
    res.json({
      success: false,
      reason: "no email exists",
    });
  }
});

app.post("/users/valid", async (req, res) => {
  const token = req.headers["Authorization"];

  if (token === undefined) {
    console.log(token);
    console.log(req.headers["Authorization"]);
    res.json({ success: false });
  } else {
    token = token.split(" ")[1];

    const options = {
      ignoreExpiration: true,
    };

    const verifyPromise = () =>
      new Promise(function (resolve, reject) {
        jwt.verify(token, config.secret, options, function (err, decoded) {
          if (err) {
            reject(err);
            return;
          }
          resolve(decoded);
        });
      });

    const decoded = await verifyPromise();
    const userId = decoded.id;

    res.json({
      success: true,
      userId: userId,
    });
  }
});
