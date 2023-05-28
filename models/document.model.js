const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 140,
    unique: false,
  },
  description : {
    type : String,
    required : true,
    minLength: 1,
    maxLength:1500,
    unique : false
  },
  professeur : {
    type : String,
    required : false,
    minLength : 1,
    maxLength : 50,
    unique : false,
  },
  note : {
    type : String,
    required : false,
    minLength:1,
    maxLength : 10,
    unique : false,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  auteur: {
    type: String,
    required: true,
  },
  auteur_name :{
    type : String,
    required : false,
  },
  matiere : {
    type : String,
    required : true,
  },
  likers: {
    type: [String],
    required: true,
  },
  comments: {
    type: [
      {
        commenterId: String,
        commenterPseudo: String,
        text: String,
        timestamp: Number,
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("documents", documentSchema);
