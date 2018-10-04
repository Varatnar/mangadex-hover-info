const fs = require('fs');
const {exec} = require('child_process');

const buildPath = "build";
const manifest = "manifest.json";

function rmDir(dirPath) {
    let files;
    try {
        files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }

    if (files.length > 0)
        for (let i = 0; i < files.length; i++) {
            let filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    fs.rmdirSync(dirPath);
}

function clean() {
    console.log("Cleaning previous build");
    rmDir(buildPath)

}

function build() {
    console.log("Building project...");
    if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(buildPath)
    }

    exec('tsc');

    fs.createReadStream(manifest).pipe(fs.createWriteStream(buildPath+"/"+manifest));

}


clean();
build();
