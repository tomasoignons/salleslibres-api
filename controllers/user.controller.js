const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  await UserModel.findById(req.params.id)
    .select("-password")
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(200).send("problème serveur");
    });
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + err);
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          activecheats: req.body.activecheats,
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
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Successfully deleted." });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ message: err });
  }
};


