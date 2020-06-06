const fs = require("fs");
const formidable = require("formidable");
const path = require("path");
const { saveProductToDB, setSkills } = require("../models/db");

module.exports.get = (req, res) => {
    res.render("pages/admin");
};

module.exports.addNewProduct = (req, res) => {
    const uploadDir = path.join(process.cwd(), "./public/assets/img/products");
    const form = formidable.IncomingForm({uploadDir});

    form.parse(req, (err, fields, files) => {
        if (err) {
            throw new Error(err);
        }

        const valid = validate(fields, files);

        if (valid.err) {
            fs.unlinkSync(files.photo.path);

            return res.redirect("/admin", { status: valid.status });
        }

        const fileName = path.join(uploadDir, files.photo.name);

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

        res.render("pages/admin", { msgfile: valid.status });
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
        res.redirect('pages/admin', { status: valid.status })
        return;
    }

    function validate({age, concerts, cities, years}) {
        if (!age || !concerts || !cities || !years) {
            return { status: 'Нужно заполнить все поля!', err: true }
        }

        return { status: 'Сохранено', err: false }
    }

    setSkills(req.body);

    res.render('pages/admin', { msgskill: valid.status })
}
