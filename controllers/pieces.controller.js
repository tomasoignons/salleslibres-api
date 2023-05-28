const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.addpieces = async (req, res)=>{
    try {

        const new_MUN_pieces = req.body.MUN_pieces + req.body.add


        await UserModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              MUN_pieces: new_MUN_pieces
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        )
          .then((docs) => {
            return res.status(200).send(docs);
          })
          .catch((err) => {
            return res.status(200).send({ message: err });
          });
      } catch (err) {
        return res.status(200).send({ message: err });
      }
}

module.exports.enleverpieces = async (req, res)=>{
    try {
        const new_MUN_pieces = req.body.MUN_pieces - req.body.enlever


        await UserModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              MUN_pieces: new_MUN_pieces
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        )
          .then((docs) => {
            return res.status(200).send(docs);
          })
          .catch((err) => {
            return res.status(200).send({ message: err });
          });
      } catch (err) {
        return res.status(200).send({ message: err });
      }
}