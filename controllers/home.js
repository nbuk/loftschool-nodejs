const path = require('path');
const nodemailer = require("nodemailer");
const config = require("../core/config").MAIL_CONFIG;
const db = require("../models/db");


module.exports.get = async (ctx, next) => {
    const products = db.get('products');
    const skills = db.get('skills');
    const msgemail = ctx.session.msgemail || null;

    if (msgemail) {
        return await ctx.render("pages/index.pug", { skills, products, msgemail });
    }

    return await ctx.render("pages/index.pug", { skills, products });
};

module.exports.post = async (ctx, next) => {
    const products = db.get('products');
    const skills = db.get('skills');
    const { name, email, message } = ctx.request.body;

    if (!name || !email || !message) {
        ctx.body = "Необходимо заполнить все поля!";
        return await ctx.render("pages/index.pug", {
            products,
            skills,
            msgemail: "Необходимо заполнить все поля!",
        });
    }
    
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: `"${ctx.request.body.name}" <${ctx.request.body.email}>`,
        to: config.mail.smtp.auth.user,
        subject: config.mail.subject,
        text:
            ctx.request.body.message.trim().slice(0, 500) +
            `\n Отправлено с: <${ctx.request.body.email}>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        }
    });

    return await ctx.render("pages/index.pug", {
        products,
        skills,
        msgemail: "Письмо отправлено",
    });
};
