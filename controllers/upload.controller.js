const UserModel = require("../models/user.model")
const fs = require("fs")
const {promisify} = require("util")
const pipeline = promisify(require("stream").pipeline)

module.exports.uploadProfil = async (req, res)=>{
    try{
        if (req.file.detectedMimeType !== "image/jpg" && req.file.detectedMimeType !== "image/png" && req.file.detectedMimeType !== "image/jpeg")
            throw Error("invalid file")
        if (req.file.size > 500000) throw Error("max size")
    } catch(err){
        const Errors = uploadErrors(err)
        return res.status(201).json(Errors)
    }

    const fileName = req.body.name + ".jpg";

    await pipeline (
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )

    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {$set : {picture : "./uploads/profil/" + fileName}},
            {new : true, upsert : true, setDefaultsOnInsert : true}
        )
            .then((docs)=>{
                return res.send(docs)
            })
            .catch((err)=>{
                return res.status(500).return(err)
            })
    } catch (err){
        return res.satus(500).send(err)
    }
}