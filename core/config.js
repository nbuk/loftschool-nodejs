const path = require('path');

module.exports.mailConfig = {
  mail: {
      subject: 'Сообщение с сайта',
      smtp: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
          },
      },
  },
};

module.exports.UPLOAD_DIR = path.join(process.cwd(), "./public/assets/img/products");