const DocumentModel = require("../models/document.model");
const { uploadErrors } = require("../utils/error.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs")
const {promisify} = require("util")
const pipeline = promisify(require("stream").pipeline)
const FormData = require("form-data")


const path = require("path")
const axios = require("axios")

module.exports.readdocuments = async (req, res) => {
  const page = parseInt(req.params.page)
  const skip = (page-1)*12
  await DocumentModel.find().skip(skip).limit(12)
    .then((docs) => {
      return res.status(201).json(docs)
    })
    .catch((err) => {
      console.log("Error to get data : " + err);
    });
};


module.exports.uploaddocument = async (req, res) =>{
  const matiere = req.params.matiere
  let channelurl = "1109583331642834947"
  switch (matiere){
    case "français":
      channelurl = "1109583418628518032";
      break;
    case "philosophie":
      channelurl = "1109583443253268510";
      break;
    case "mathématiques":
      channelurl = "1109583460001136680";
      break;
    case "physique":
      channelurl = "1109583473586487477";
      break;
    case "chimie":
      channelurl = "1109583484101595278";
      break;
    case "svt":
      channelurl = "1109583496793571390";
      break;
     case "ses":
       channelurl = "1109583512316686458";
      break;
    case "histoire":
      channelurl = "1109583524291428422";
      break;
    case "géographie":
      channelurl = "1109583539697094727";
      break;
    case "géopolitique":
      channelurl = "1109583554796593172";
      break;
    case "ens-svt":
      channelurl = "1109583595787538432";
      break;
     case "ens-physique":
      channelurl = "1109583631980167168";
      break;
    case "emc":
      channelurl = "1109583674392969287";
      break;
    
  }


  console.log(matiere)
  if (req.files === null){
    res.status(400).send("no file uploaded")
  }

  const file = req.files.file
  const fileName = file.name.replace(" ", "-")
  let url_document = ""

  // await file.mv(`${__dirname}/uploads/${fileName}`)
      const url = `https://discord.com/api/v9/channels/${channelurl}/messages`;
      const tokenSecret = `${process.env.DISCORD_SECRET}`;
      // const filePath = `./controllers/uploads/${fileName}`;
      
      const headers = {
        'authorization': tokenSecret,
        'Content-Type': 'multipart/form-data',
      };
      
      // const fileStream = fs.createReadStream(filePath);
      
      const formData = new FormData();
      formData.append('file', file, fileName);
      
      const payload = {
        content: '',
      };
      
      formData.append('payload_json', JSON.stringify(payload));
      
      axios
        .post(url, formData, { headers })
        .then(() => {
          console.log('Message sent successfully');
          axios({
            method : "get",
            url : `https://discord.com/api/v9/channels/${channelurl}/messages?limit=1`,
            headers : headers
          })
            .then((docs)=>{
              url_document = docs.data[0].attachments[0].url                 
              fs.unlinkSync(`${__dirname}/uploads/${fileName}`) 
              if (url_document == ""){                

                res.status(201).send("il y a eu un problème")
              }
              else{
                res.status(200).json({url : url_document})
              }
            })
        })
        .catch((error) => {
          res.status(201).send({ message : "Une erreur a eu lieu en stockant le fichier. Vérifiez si le fichier fait moins de 8Mo, et réessayez dans quelques instants. Si cela se reproduit, contactez l'administrateur du site"});
        });
     }


module.exports.createdocument = async (req, res) => {

  //enregistrer le document dans la base de donnée
  const title = req.body.title
  const description = req.body.description
  const professeur = req.body.professeur
  const note = req.body.note
  const url = req.body.url
  const auteur = req.body.auteur
  const auteur_name = req.body.auteur_name
  const matiere = req.body.matiere
  const NewDocument = new DocumentModel({
    title: title,
    description : description,
    professeur : professeur,
    note : note,
    url: url,
    auteur: auteur,
    auteur_name : auteur_name,
    matiere : matiere,
    likers: [],
    comments: [],
  });
  try {
    await NewDocument.save()
      .then((docs) => {
        return res.status(201).json(docs);
      })
      .catch((err) => {
        console.log(err)
        let message = ""
        if (err.code === 11000) {
          message = "le document a déjà été uploadé"
        }
        else{
          message = "vérifiez que votre doc fait moins de 8Mo, que ce n'est pas un fichier bizarre, et que vous avez tout complété dans le formulaire. Ensuite, réessayez"
        }
        return res.status(201).send({message : message});
      });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

module.exports.updatedocument = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

  const updatedRecord = {
    title: req.body.title,
    description : req.body.description,
    note : req.body.note,
    professeur : req.body.professeur,
    matiere : req.body.matiere
  };

  await DocumentModel.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: updatedRecord },
    { new: true }
  )
    .then((docs) => {
      return res.status(200).send(docs);
    })
    .catch((err) => {
      return res.status(200).send(err);
    });
};

module.exports.deletedocument = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await DocumentModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ message: err });
  }
};


//je crois que ce bout de code ne sert strictement à rien, vu que le document se fait dans la base de donnée
// module.exports.downloaddocument = async (req, res) =>{
//   const url = ""
//   const chemin = path.resolve(__dirname, "files", "image.jpg")

//   const response = axios({
//     method : "GET",
//     url : url,
//     responseType : "stream"
//   })

//   response.data.pipe(fs.createWriteStream(chemin))
// }


module.exports.getdocument = async(req, res) =>{
  if(!ObjectID.isValid(req.params.id))
    return res.status(400).send("mauvaise ID : " + req.params.id)

  await DocumentModel.findById({_id : req.params.id})
    .then((docs) =>{
      return res.status(200).send(docs)
    })
    .catch((err)=>{
      return res.status(500).send(err)
    })

}


module.exports.getdocumentuser = async(req, res) =>{
  if(!ObjectID.isValid(req.params.id))
    return res.status(400).send("mauvaise ID : " + req.params.id)
  

  const page = parseInt(req.params.page)
  const skip = (page-1)*12
  await DocumentModel.find({auteur : req.params.id}).skip(skip).limit(12)
    .then ((docs)=>{
      console.log(docs)
      return res.status(200).send(docs)
    })
    .catch((err)=>{
      return res.status(500).send(err)
    })
}