const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const path = require("path");

const adapter = new FileAsync(path.join(process.cwd(), "./models/myDB.json"));

low(adapter).then((db) => {
    db.defaults({
        products: [],
        skills: {
            age: {
                number: "123",
                text: "Возраст начала занятий на скрипке",
            },
            concerts: {
                number: "123",
                text: "Концертов отыграл",
            },
            cities: {
                number: "123",
                text: "Максимальное число городов в туре",
            },
            years: {
                number: "123",
                text: "Лет на сцене в качестве скрипача",
            },
        },
    }).write().then(() => console.log('defaults saved'));
});

module.exports.loadProducts = () => {
    return new Promise((resolve, reject) => {
        low(adapter).then(async (db) => {
            resolve(db.get("products").value());
        });
    });
};

module.exports.loadSkills = () => {
    return new Promise((resolve, reject) => {
        low(adapter).then((db) => {
            resolve(db.get("skills").value());
        });
    });
};

module.exports.saveProductToDB = (data) => {
    low(adapter).then((db) => {
        db.get("products")
            .push(data)
            .write()
            .then(() => console.log("DB has been updated"));
    });
};

module.exports.setSkills = (data) => {
    low(adapter).then((db) => {
        let skills = db.get("skills").value();
        for (skill in data) {
            skills[skill].number = data[skill];
        }
        db.set("skills", skills)
            .write()
            .then(() => console.log("Skills has been updated"));
    });
};
