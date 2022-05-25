const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "himalayainfotech33@gmail.com",
        pass: "33@Himalaya"
    }
})

module.exports = transporter;