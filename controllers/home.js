const nodemailer = require("nodemailer");
const config = require("../core/mailConfig.json");
const { loadProducts, loadSkills } = require("../models/db");

module.exports.get = async (ctx, next) => {
    const products = await loadProducts();
    const skills = await loadSkills();

    return await ctx.render("pages/index.pug", { skills, products });
};

module.exports.post = async (ctx, next) => {
    const products = await loadProducts();
    const skills = await loadSkills();
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
