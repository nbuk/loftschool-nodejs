const fs = require("fs");
const path = require("path");

const base = process.argv[2];
const finalPath = process.argv[3];
const shouldDelete = process.argv[4];

const sort = (base, finalPath) => {
    const files = fs.readdirSync(base);

    files.forEach((item) => {
        const localBase = path.join(base, item);
        const state = fs.statSync(localBase);

        if (state.isDirectory()) {
            sort(localBase, finalPath);
        } else {
            if (!fs.existsSync(`./${finalPath}`)) {
                fs.mkdirSync(`./${finalPath}`);
            }

            if (!fs.existsSync(path.join(finalPath, item[0].toUpperCase()))) {
                fs.mkdirSync(path.join(finalPath, item[0].toUpperCase()));
            }

            fs.link(
                localBase,
                path.join(finalPath, item[0].toUpperCase(), item),
                (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                }
            );
        }
    });
};

const removeFiles = (base, cb) => {
    const files = fs.readdirSync(base);

    files.forEach(async (item) => {
        const localBase = path.join(base, item);
        const state = fs.statSync(localBase);

        if (state.isDirectory()) {
            removeFiles(localBase, () => {
                fs.rmdir(localBase, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        } else {
            fs.unlinkSync(localBase);
        }
    });

    cb();
};

const removeDir = (base) => {
    removeFiles(base, () => {
        fs.rmdir(base, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
};

sort(base, finalPath);

if (shouldDelete === "-d") {
    removeDir(base);
}
