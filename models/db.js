const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

class DataBase {
    constructor(path) {
        this._dbFilePath = path;
        this._data = this._getData(path);
    }

    _getData(path) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    get(selector) {
        return this._data[selector];
    }

    write(selector, obj) {
        this._data[selector] = obj;
        const dataToWrite = JSON.stringify(this._data);
        writeFile(this._dbFilePath, dataToWrite)
            .then(() => console.log('Data saved'))
            .catch((err) => {
                throw new Error(err);
            });
    }
}

module.exports = new DataBase(path.join(process.cwd(), './models/myDB.json'));
