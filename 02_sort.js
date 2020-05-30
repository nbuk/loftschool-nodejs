const fs = require("fs");
const path = require("path");

const base = process.argv[2];
const finalPath = process.argv[3];
const shouldDelete = process.argv[4];

const sortFiles = (base, finalPath) => {
    return new Promise(async (resolve, reject) => {
        try {
            const readDir = (base) => {
                const files = fs.readdirSync(base);
    
                files.forEach(file => {
                    const localBase = path.join(base, file);
                    const state = fs.statSync(localBase);
    
                    if (state.isDirectory()) {
                        readDir(localBase)
                    } else {
                        moveFile(localBase, finalPath, file);
                    }
                })
            };
    
            const moveFile = (localBase, finalPath, fileName) => {
                if (!fs.existsSync(`./${finalPath}`)) {
                    fs.mkdirSync(`./${finalPath}`);
                }
    
                if (!fs.existsSync(path.join(finalPath, fileName[0].toUpperCase()))) {
                    fs.mkdirSync(path.join(finalPath, fileName[0].toUpperCase()));
                }
    
                fs.link(
                    localBase,
                    path.join(finalPath, fileName[0].toUpperCase(), fileName),
                    (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    }
                );
            }
    
            readDir(base);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

const removeFiles = (base) => {
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(base);

        files.forEach((item) => {
            const localBase = path.join(base, item);
            const state = fs.statSync(localBase);
    
            if (state.isDirectory()) {
                removeDir(localBase);
            } else {
                fs.unlink(localBase, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    return;
                });
            }
        });

        resolve();
    })
};

const removeDir = async (base) => {
    await removeFiles(base);
    fs.rmdir(base, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

sortFiles(base, finalPath).then(() => {
    console.log("Files sorted");
    if (shouldDelete === "-d") {
        removeDir(base);
        console.log('Original path has been deleted');
    }
});
