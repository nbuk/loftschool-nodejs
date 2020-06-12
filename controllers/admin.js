const fs = require("fs");
const util = require('util');
const unLinkFile = util.promisify(fs.unlink);
const renameFile = util.promisify(fs.rename);
const formidable = require("formidable");
const path = require("path");
const DataBase = require("../models/db");
const uploadDir = require('../core/config').UPLOAD_DIR;

const db = new DataBase(path.join(process.cwd(), './models/myDB.json'));

module.exports.get = async (ctx, next) => {
    const msgfile = ctx.session.msgfile || '';
    
    return await ctx.render("pages/admin.pug", { msgfile });
};

module.exports.addNewProduct = async (ctx, next) => {
    const file = ctx.request.files.photo;
    const formData = ctx.request.body;
    const valid = validate(ctx);

    if (valid.err) {
        unLinkFile(file.path);
        return await ctx.render('pages/admin.pug', { msgfile: valid.status })
    }

    const fileName = path.join(uploadDir, file.name);

    renameFile(file.path, fileName).then(() => console.log('File saved'));

    function validate(ctx) {
        const fileData = ctx.request.files.photo;
        const formData = ctx.request.body;

        if (fileData.name === '' || fileData.size === 0) {
            return { status: 'Картинка не загружена', err: true }
        }

        if (!formData.name || !formData.price) {
            return { status: 'Не указаны название товара / цена', err: true }
        }

        return { status: 'Успешно загружено', err: false }
    }

    const products = db.get('products');

    products.push({
        name: formData.name,
        price: formData.price,
        src: `./assets/img/products/${file.name}`
    })

    db.write('products', products);

    ctx.session.msgfile = valid.status;
    ctx.redirect('/admin');
}

// module.exports.addNewProduct = (req, res) => {
//     const uploadDir = path.join(process.cwd(), "./public/assets/img/products");
//     const form = formidable.IncomingForm({uploadDir});

//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             throw new Error(err);
//         }

//         const valid = validate(fields, files);

//         if (valid.err) {
//             fs.unlinkSync(files.photo.path);

//             return res.redirect("/admin", { status: valid.status });
//         }

//         const fileName = path.join(uploadDir, files.photo.name);

//         fs.rename(files.photo.path, fileName, (err) => {
//             if (err) {
//                 console.error(err);
//                 return;
//             }
//         });

//         saveProductToDB({
//             name: fields.name,
//             price: fields.price,
//             src: `./assets/img/products/${files.photo.name}`,
//         });

//         res.render("pages/admin", { msgfile: valid.status });
//     });

//     const validate = (fields, files) => {
//         if (files.photo.name === "" || files.photo.size === 0) {
//             return { status: "Картинка не загружена", err: true };
//         }

//         if (!fields.name) {
//             return { status: "Нет имени", err: true };
//         }

//         if (!fields.price) {
//             return { status: "Не указана цена", err: true };
//         }

//         return { status: "Успешно загружено", err: false };
//     };
// };

// module.exports.setSkills = (req, res) => {

//     const valid = validate(req.body);

//     if (valid.err) {
//         res.redirect('pages/admin', { status: valid.status })
//         return;
//     }

//     function validate({age, concerts, cities, years}) {
//         if (!age || !concerts || !cities || !years) {
//             return { status: 'Нужно заполнить все поля!', err: true }
//         }

//         return { status: 'Сохранено', err: false }
//     }

//     setSkills(req.body);

//     res.render('pages/admin', { msgskill: valid.status })
// }
