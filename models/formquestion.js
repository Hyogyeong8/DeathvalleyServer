'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class formQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const GoogleForm = models.GoogleForm
      GoogleForm.hasMany(formQuestion)
      // formQuestion.belongsTo(GoogleForm)
    }
  };
  formQuestion.init({
    formQuestionId: DataTypes.INTEGER,
    googleFormId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    qType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'formQuestion',
  });
  return formQuestion;
};