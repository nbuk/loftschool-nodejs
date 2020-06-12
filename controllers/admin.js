const fs = require("fs");
const formidable = require("formidable");
const path = require("path");
const UPLOAD_DIR = require('../core/config').UPLOAD_DIR;
const { saveProductToDB, setSkills } = require("../models/db");

module.exports.get = (req, res) => {
    const msgfile = req.flash('msgfile');
    const msgskill = req.flash('msgskill');

    if (msgfile.length) {
        return res.render("pages/admin", { msgfile });
    }

    if (msgskill.length) {
        return res.render('pages/admin', { msgskill });
    }

    res.render('pages/admin');
};

module.exports.addNewProduct = (req, res) => {
    const form = formidable.IncomingForm({UPLOAD_DIR});

    form.parse(req, (err, fields, files) => {
        if (err) {
            throw new Error(err);
        }

        const valid = validate(fields, files);

        if (valid.err) {
            fs.unlinkSync(files.photo.path);

            req.flash('msgfile', valid.status);
            return res.redirect("/admin");
        }

        const fileName = path.join(UPLOAD_DIR, files.photo.name);

        fs.rename(files.photo.path, fileName, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        saveProductToDB({
            name: fields.name,
            price: fields.price,
            src: `./assets/img/products/${files.photo.name}`,
        });

        req.flash('msgfile', valid.status);
        res.redirect("/admin");
    });

    const validate = (fields, files) => {
        if (files.photo.name === "" || files.photo.size === 0) {
            return { status: "Картинка не загружена", err: true };
        }

        if (!fields.name) {
            return { status: "Нет имени", err: true };
        }

        if (!fields.price) {
            return { status: "Не указана цена", err: true };
        }

        return { status: "Успешно загружено", err: false };
    };
};

module.exports.setSkills = (req, res) => {

    const valid = validate(req.body);

    if (valid.err) {
        req.flash('msgskill', valid.status);
        return res.redirect('/admin');
    }

    function validate({age, concerts, cities, years}) {
        if (!age || !concerts || !cities || !years) {
            return { status: 'Нужно заполнить все поля!', err: true }
        }

        return { status: 'Сохранено', err: false }
    }

    setSkills(req.body);

    req.flash('msgskill', valid.status);
    res.redirect('/admin');
}
