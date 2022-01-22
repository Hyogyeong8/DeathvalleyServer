const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 8000; // -- 처음에 할땐 3000이라고 하고 한 후
//localhost:3000 으로 하시는 것을 추천
//나중에 80포트를 써야 할 일이 옵니다.
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/static', express.static('public')); 

var bodyParser = require('body-parser');                                                                     
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.listen(port, () => console.log(`Server up and running on port ${port}.`));

// require('./routes/auth.routes')(app);
require('./routes/googleform.routes')(app);

const db = require("./models");
const User = db.User;
const GoogleForm = db.GoogleForm;
const FormQuestion = db.formQuestion;
const Option = db.Option;
const Answer = db.Answer;

app.get("/", (req, res) => {
  console.log('---');
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
    bodyContent: req.body.formId
  });
});

app.get("/users/create", async (req, res) => {

  const userList = await User.create({
    firstName: "HG",
    lastName: "Kim",
  })

  return res.json({userList: userList, message: `user${userList.id} is created`});
})

app.get("/users/:id", async (req, res) => {

  const userList = await User.findOne({
    where: {id: parseInt(req.params.id)}
  })

  return res.json({userList: userList, message: "fetched"});
})

app.get("/formQuestion/all", async (req, res) =>{
  const formQuestions = await FormQuestion.findAll({

  })
  res.json({formQuestions: formQuestions})
})

app.post("/", async(req, res) => {
  const data = req.body
  console.log(data)
  res.json({message: "success!"})
  const googleform = await GoogleForm.create({
    title: data.title,
    desc: data.desc,
  })
  var i=0;
  console.log(data.question.length)
  while(i<data.question.length){
    const formQuestion = await FormQuestion.create({
      title: data.question[i].title,
      qType: data.question[i].qType,
      desc: data.question[i].desc,
      googleFormId: googleform.id,
    })
    var j=0;
    while(j<data.question[i].options.length){
      const option = await Option.create({
        title: data.question[i].options[j].title,
        formQuestionId: formQuestion.id,
      })
      j = j+1;
    }
    i= i+1;
  }
})

app.get("/googleform/get", async(req, res) => {
  const googleform = await GoogleForm.findAll();
  res.send(googleform);
})

app.get("/getQuestions", async(req, res)=>{
  console.log(req.query['id'])
  var id = parseInt(req.query['id'])
  const formquestion = await FormQuestion.findAll({
    where: {googleFormId: id},
    include: Option
  })
  // const option = await formquestion.getOptions();
  const form = await GoogleForm.findOne({
    where: {id: id}
  })
  res.json({formquestion: formquestion, form: form});
})

app.post("/form", async(req, res)=>{
  const data = req.body
  console.log(data)
  var i=0
  while(i<data.length){
    const answer = await Answer.create({
      formQuestionId: data[i].qId,
      value: data[i].value
    })
    i=i+1;
  }
})
