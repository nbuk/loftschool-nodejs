const fs = require("fs");
const path = require("path");

const base = process.argv[2];
const finalPath = process.argv[3];
const shouldDelete = process.argv[4];

const sort = (base) => {
    const files = fs.readdirSync(base);

    files.forEach((item) => {
        const localBase = path.join(base, item);
        const state = fs.statSync(localBase);

        if (state.isDirectory()) {
            sort(localBase);
        } else {
            if (!fs.existsSync(`./${finalPath}`)) {
                fs.mkdirSync(`./${finalPath}`);
            }

            if (!fs.existsSync(`./${finalPath}/${item[0].toUpperCase()}`)) {
                fs.mkdirSync(`./${finalPath}/${item[0].toUpperCase()}`);
            }

            fs.link(
                localBase,
                `./${finalPath}/${item[0].toUpperCase()}/${item}`,
                (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                }
            );
        }
    });
};

const removeFiles = (base) => {
    const files = fs.readdirSync(base);

    files.forEach(item => {
        const localBase = path.join(base, item);
        const state = fs.statSync(localBase);

        if (state.isDirectory()) {
            removeDir(localBase);
        } else {
            fs.unlink(localBase, err => {
                if (err) {
                    console.log(err)
                }
                return;
            });
        }
    })
}

const removeDir = (base) => {
    removeFiles(base);
    fs.rmdir(base, err => {
        if (err) {
            console.log(err);
        }
    });
} 

sort(base);

if (shouldDelete === '-d') {
    removeDir(base);
}
