const UserModel = require('../models/user.model')
const jwt = require("jsonwebtoken")
const { signUperrors, signInErrors } = require('../utils/error.utils')

const Token = require("../models/token.model")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

const maxAge = 3*24*60*60*1000
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
}

module.exports.signUp = async(req, res) => {
    const pseudo = req.body.pseudo
    const email = req.body.email
    const password = req.body.password
    try{
        const user = await UserModel.create({
            pseudo: pseudo,
            email : email,
            password : password,
            MUN_pieces : 20
        });
        const token = await new Token({
            userId : user._id,
            token : crypto.randomBytes(32).toString("hex")
        }).save()

        const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`
        await sendEmail(user.email, "Verify Email", url)

        res.status(200).send({message : "Un Email a été envoyé sur votre compte, veuillez vérifier svp"})

    }
    catch(err){
        console.log(err)
        const errors = signUperrors(err)
        res.status(200).send({errors})
    }
}

module.exports.signIn = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try{
        const user = await UserModel.login({
            email : email,
            password : password
        })

        if(!user.verified){
            let token = await Token.findOne({userId : user._id})
            if (!token){
                const token = await new Token({
                    userId : user._id,
                    token : crypto.randomBytes(32).toString("hex")
                }).save()
        
                const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`
                await sendEmail(user.email, "Verify Email", url)
        
                res.status(200).send({message : "Un Email a été envoyé sur votre compte, veuillez vérifier svp"})
            }

        }

        const token = createToken(user._id)
        console.log(token, user._id)
        res.cookie("jwt", token, {
            domain: '.salleslibresv2.netlify.app',
            path: '/',
            secure: true,
            httpOnly: true,
            maxAge : maxAge,
        })
        res.status(200).json({user : user._id})
    }
    catch(err){
        const errors = signInErrors(err)
        res.status(200).send({errors})
    }
}

module.exports.logout = (req, res)=>{
    res.cookie("jwt", "", {maxAge : 1})
    res.redirect("/")
}

module.exports.verifyToken = async (req, res) =>{
    try{
        const user = await UserModel.findOne({_id : req.params.id})
        if (!user){
            return res.status(400).send({message : "Lien invalide"})
        }

        const token = await Token.findOne({
            userId : user._id,
            token : req.params.token
        })

        if (!token) return res.status(400).send({message : "Lien invalide"})

        await UserModel.findOneAndUpdate(
            { _id: user._id },
            {
              $set: {
                verified: true,
              },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )

        await Token.findByIdAndDelete({ _id: token._id });

        res.status(200).send({message : "Email verified successfully"})
    } catch (err){
        console.log(err)
        res.status(500).send({message: "le serveur a fait de la merde"})
    }
}