const config = require("../core/config").mailConfig;
const nodemailer = require("nodemailer");
const { loadProducts, loadSkills } = require("../models/db");

module.exports.get = async (req, res) => {
    const products = await loadProducts();
    const skills = await loadSkills();
    const msgemail = req.flash('mesgemail');

    if (msgemail.length) {
        return res.render("pages/index", { skills, products, msgemail });
    }

    res.render("pages/index", { skills, products });
};

module.exports.post = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.message) {
        req.flash('mesgemail', 'Все поля обязательны для заполнения!');
        return res.redirect('/');
    }

    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: `"${req.body.name}" <${req.body.email}>`,
        to: config.mail.smtp.auth.user,
        subject: config.mail.subject,
        text:
            req.body.message.trim().slice(0, 500) +
            `\n Отправлено с: <${req.body.email}>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash('mesgemail', `При отправке письма произошла ошибка: ${error}`);
            console.error(error);
            return res.redirect('/');
        }

        req.flash('mesgemail', 'Письмо отправлено!');
        return res.redirect('/');
    });
};
