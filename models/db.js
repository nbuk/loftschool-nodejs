const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const fs = require('fs');

const adapter = new FileSync("./myDB.json");
const db = low(adapter);

console.log(db.get('goods'));

module.exports.db = db;
module.exports.save = (data) => {
  const toWrite = JSON.stringify(data, null, '\t');
  console.log(toWrite);
  fs.writeFileSync(path.join(process.cwd(), './models/myDB.json'), toWrite);
  console.log('Saved');
}
