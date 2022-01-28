const db = require("../models");
const User = db.User;
const GoogleForm = db.GoogleForm;
const FormQuestion = db.formQuestion;
const Option = db.Option;
const Answer = db.Answer;

module.exports = (app) => {
  
  app.get("/googleform/last", async (req, res) => {
  
    const googleform = await GoogleForm.findOne({
      order: [["createdAt", "DESC"]],
      raw: true
    })
    console.log(googleform);
    return res.json({googleform: googleform});
  })
  
  app.get("/googleform/all", async (req, res) => {
  
    const googleform = await GoogleForm.findAll({
      order: [["createdAt", "DESC"]],
      // raw: true
    })
    // console.log(googleform);
    return res.json({googleform: googleform});
  })
  
  app.get("/googleform/first", async (req,res) => {
    const googleForm = await GoogleForm.findOne({
      order: [["createdAt", "ASC"]]
    })
  
    const formQuestions = await googleForm.getFormQuestions();
    res.json({googleForm: googleForm, formQuestion: formQuestions})
  })

  app.post("/googleform/create", async(req, res) => {
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

  app.get("/googleform/getForms", async(req, res) => {
    const googleform = await GoogleForm.findAll();
    res.send(googleform);
  })

  app.get("/googleform/getQuestions", async(req, res)=>{
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

  app.post("/googleform/answer", async(req, res)=>{
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
    res.json({success: true})
  })
    
}