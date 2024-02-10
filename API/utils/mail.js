"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMT_AUTH_USER,
        pass: process.env.SMT_AUTH_PWD,
    },
});


module.exports = {
    sendMail: async function(to, subject, text, html) {
        return await transporter.sendMail({
            from: {
                name: 'Nodemailer',
                address: process.env.SMT_AUTH_USER
            },
            to: to,
            subject: subject,
            text: text,
            html: html,
        });
    }
}