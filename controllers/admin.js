const fs = require("fs");
const formidable = require("formidable");
const path = require("path");
const { db, save } = require("../models/db");

module.exports.get = (req, res) => {
    res.render("pages/admin");
};

module.exports.post = (req, res) => {
    const uploadDir = path.join(process.cwd(), "./public/upload");
    const form = formidable.IncomingForm({
        uploadDir: uploadDir,
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            throw new Error(err);
        }

        const valid = validate(fields, files);

        if (valid.err) {
            fs.unlinkSync(files.photo.path);

            return res.redirect("/admin");
        }

        const fileName = path.join("./upload/", files.photo.name);

        fs.rename(files.photo.path, fileName, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        const dir = fileName.substring(fileName.indexOf("\\"));

        const json = {
            name: fields.name,
            price: fields.price,
            imagePath: fileName,
        };

        save(json);

        db.get("goods")
            .push({
                name: fields.name,
                price: fields.price,
                imagePath: dir,
            })
            .write();

        console.log(db.get("goods"));
        res.redirect("/admin");
    });

    const validate = (fields, files) => {
        if (files.photo.name === "" || files.photo.size === 0) {
            return { status: "Картинка не загружена", err: true };
        }

        if (!fields.name) {
            return { status: "Нет имени", err: true };
        }

        return { status: "Успешно загружено", err: false };
    };
};
