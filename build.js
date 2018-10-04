const fs = require('fs');
const {exec} = require('child_process');

const buildPath = "build";
const chromeExtensionManifest = "manifest.json";

let watch = false;

for (let i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case "-w":
            watch = true;
            break;
        default:
            throw "Unexpected argument : " + process.argv[i]
    }
}

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

    fs.createReadStream(chromeExtensionManifest).pipe(fs.createWriteStream(buildPath + "/" + chromeExtensionManifest));


    if (watch) {
        exec('tsc -w').stdout.on('data', (data) => {
            console.log(data.toString())
        });
    } else {
        exec('tsc').stdout.on('data', (data) => {
            console.log(data.toString())
        });
    }

}

clean();
build();
