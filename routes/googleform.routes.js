const db = require("../models");
const User = db.User;
const GoogleForm = db.GoogleForm;
const FormQuestion = db.formQuestion;
const Option = db.Option;

module.exports = (app) => {

  app.get("/googleform/create", async (req, res) => {

    const googleform = await GoogleForm.create({
      title: `${Math.random()}`,
    })
  
    return res.json({googleform: googleform, message: "Here is our googleform"});
  })
  
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
  
}