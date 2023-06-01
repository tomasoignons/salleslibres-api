const DocumentModel = require("../models/document.model");



module.exports.searchdocument = async (req, res) =>{
    try{
        const page = parseInt(req.query.page)-1 || 0;
        const limit = parseInt(req.query.limit) || 12;
        const search = req.query.search || "";
        let sort = req.query.sort || "note";
        let matieres = req.query.matiere || "All";

        const matiereOptions = [
            "français",
            "philosophie",
            "mathématique",
            "physique",
            "chimie",
            "svt",
            "ses",
            "histoire",
            "géographie",
            "géopolitique",
            "ens-svt",
            "ens-physique",
            "emc"
        ]

        if (matieres==="All"){
            matieres = [...matiereOptions]
        } else{
            matieres = req.query.matiere.split(",")
        }
        
        if (req.query.sort){
            sort = req.query.sort.split(",")
        } else{
            sort = [sort]
        }

        let sortBy = {}
        if(sort[1]){
            sortBy[sort[0]] = sort[1]
        } else{
            sortBy[sort[0]] = "asc"
        }
        await DocumentModel.find({title : {$regex: search, $options:"i"}})
            .where("matiere").in([...matieres]).sort(sortBy).skip(page * limit).limit(limit)
            .then((docs) => {
                const response = {
                    error : false,
                    page : page +1,
                    limit,
                    matieres : matiereOptions,
                    documents : docs,
                }

                res.status(200).json(response)
            })
            .catch((err) => {
                console.log("Error to get data : " + err);
            });

    } catch(err){
        console.log(err)
        res.status(500).json({error: true, message:"Internal Server Error"})
    }
}