const nodemailer = require("nodemailer")

module.exports = async(email, subject, text) =>{
    console.log("j'essaye d'envoyer un meail")
    try{
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            port : Number(process.env.EMAIL_PORT),
            secure : true,
            auth : {
                user : process.env.USER,
                pass : process.env.PASS
            }

        });

        await transporter.sendMail({
            from : "Salleslibres <tomasoignons@gmail.com>",
            to : email,
            subject : subject,
            text : text
        })
        console.log("Email send successfully")
    } catch(err){
        console.log("Email not send")
        console.log(err)
    }
}