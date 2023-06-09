module.exports.signUperrors = (err) => {
    let errors = {pseudo : "", email : "", password: ""}
    console.log(err)

    if (err.message.includes("pseudo"))
        errors.pseudo = "Pseudo incorrect ou déjà pris"

    if (err.message.includes("email"))
        errors.email = "Email incorrect"
    
    if (err.message.includes("password"))
        errors.password = "le mot de passe doit faire 6 caractères minimum"

    if(err.code == 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
        errors.pseudo = "Ce pseudo est déjà enregistré"
        
    if(err.code == 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Ce mail est déjà enregistré"

    return errors
}

module.exports.signInErrors = (err) =>{
    let errors = {email : "", password: ""}

    if (err.message.includes("email")) 
        errors.email = "Email Inconnu"

    if (err.message.includes('password'))
        errors.password = "le mot de passe est incorrect"

    return errors
}

module.exports.uploadErrors = (err) =>{
    let errors = {format : "", maxSize : ""}
    if (err.message.includes("invalid file"))
        errors.format = "Format incompatible"
    if (err.message.includes("max size"))
        errors.maxSize = "le fichier dépasse 500ko"
}