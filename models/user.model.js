const mongoose = require("mongoose")
const {isEmail} = require("validator")
const bcrypt = require("bcrypt")


//vérification à faire en front je pense que c'est mieux
const Fenelonien = (mail)=>{
    const domaine = mail.split("@")[1]
    if (domaine == "edufenelon.org"){
        return(true)
    } else {
        return(false)
    }
}


const userSchema = new mongoose.Schema(
    {
        pseudo : {
            type : String,
            required : true,
            minLength : 3,
            maxLength : 55,
            unique : true,
            trimp : true
        },
        email : {
            type : String,
            required : true,
            validate : [isEmail],
            lowercase : true,
            unique : true,
            trimp : true,
        },
        password : {
            type : String,
            required : true,
            maxLength : 1024,
            minLength: 6,
        },
        activecheats : {
            type : [String]
        },
        verified : {
            type : Boolean,
            default :false,
        },
        MUN_pieces : {
            type : Number,
            default : 0,
            required : true
        }
        
    }
)


//on joue la fonction avant de sauvegarder l'user
userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.login = async function ({email, password}){
    const user = await this.findOne({email})
    if (user){
        const auth = await bcrypt.compare(password, user.password)
        if (auth){
            return(user)
        }
        throw Error("Incorrect password")
    }
    throw Error("Incorrect email")
}

const UserModel = mongoose.model("user", userSchema)
module.exports = UserModel;