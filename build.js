const fs = require('fs');
const browserify = require('browserify');
const tsify = require('tsify');
const watchify = require('watchify');
const ncp = require('ncp').ncp;

const buildPath = "build";

let watch = false;
let cleanFlag = false;

let watchFirstFlag = false;

for (let i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case "-w":
            watch = true;
            break;
        case "-c":
            cleanFlag = true;
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

    fs.createReadStream("src/chrome_manifest.json").pipe(fs.createWriteStream(buildPath + "/manifest.json"));
    fs.createReadStream("src/styles/style.css").pipe(fs.createWriteStream(buildPath + "/style.css"));

    ncp("src/assets", buildPath + "/assets");

    let b = browserify({
        cache: {},
        packageCache: {}
    });
    b.add("src/main.ts");
    b.plugin(tsify, {noImplicitAny: true});

    if (watch) {
        b.plugin(watchify);
        b.on('update', (ids) => {
            console.log("Change detected...");
            console.log(`File "${ids[1]}" was modified`);

            bundle();
        });
        bundle(true);
    } else {
        bundle();
    }

    function bundle(watching) {
        b.bundle()
            .on('error', console.error)
            .pipe(fs.createWriteStream("build/main.js"))
            .on('finish', () => {
                if (!watchFirstFlag) {
                    console.log("Build completed");

                    if (watching) {
                        console.log("\nWatching for changes...\n")
                    }

                    watchFirstFlag = true;
                } else {
                    console.log("Rebuild completed");

                }
            });
    }
}

clean();
if (cleanFlag) return;
build();
