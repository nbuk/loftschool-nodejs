const fs = require('fs');
const path = require('path');
const util = require('util');
const unLinkFile = util.promisify(fs.unlink);
const renameFile = util.promisify(fs.rename);
const uploadDir = require('../core/config').UPLOAD_DIR;
const db = require('../models/db');

module.exports.get = async (ctx, next) => {
    const msgfile = ctx.session.msgfile || null;
    const msgskill = ctx.session.msgskill || null;

    return await ctx.render('pages/admin.pug', { msgfile, msgskill });
};

module.exports.addNewProduct = async (ctx, next) => {
    const file = ctx.request.files.photo;
    const formData = ctx.request.body;
    const valid = validate();

    if (valid.err) {
        unLinkFile(file.path);
        return await ctx.render('pages/admin.pug', { msgfile: valid.status });
    }

    const fileName = path.join(uploadDir, file.name);

    renameFile(file.path, fileName).then(() => console.log('File saved'));

    const products = db.get('products');

    products.push({
        name: formData.name,
        price: formData.price,
        src: `./assets/img/products/${file.name}`,
    });

    db.write('products', products);

    ctx.session.msgfile = valid.status;
    ctx.redirect('/admin');

    function validate() {
        if (file.name === '' || file.size === 0) {
            return { status: 'Картинка не загружена', err: true };
        }

        if (!formData.name || !formData.price) {
            return { status: 'Не указаны название товара / цена', err: true };
        }

        return { status: 'Успешно загружено', err: false };
    }
};

module.exports.setSkills = async (ctx, next) => {
    const { age, concerts, cities, years } = ctx.request.body;
    const valid  = validate(ctx.request.body);

    if (valid.err) {
        ctx.session.msgskills = valid.status;
        return ctx.redirect('/admin');
    }

    const skills = db.get('skills');

    skills.age.number = age;
    skills.concerts.number = concerts;
    skills.cities.number = cities;
    skills.years.number = years;

    db.write('skills', skills);

    ctx.session.msgskill = valid.status;
    return ctx.redirect('/admin')

    function validate({ age, concerts, cities, years }) {
        if (!age || !concerts || !cities || !years) {
            return { status: 'Нужно заполнить все поля!', err: true };
        }

        return { status: 'Сохранено', err: false };
    }
};