const config = require('../core/mailConfig.json');
const nodemailer = require('nodemailer');

module.exports.get = (req, res) => {
    res.render("pages/index");
};

module.exports.post = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.message) {
      return res.end('Все поля обязательны для заполнения!');
    }

    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
      from: `"${req.body.name}" <${req.body.email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text:
        req.body.message.trim().slice(0, 500) +
        `\n Отправлено с: <${req.body.email}>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.end(`При отправке письма произошла ошибка: ${error}`);
      }

      return res.end('Письмо отправлено!');
    })
};
