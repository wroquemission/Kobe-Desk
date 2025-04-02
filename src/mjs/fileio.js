const fs = require('fs');
const path = require('path');
const app = require('electron').app;

class FileIO {
    constructor() {
        this.path = app.getPath('userData') + path.normalize('/Data/');
    }

    pathExists(testPath) {
        return fs.existsSync(testPath);
    }

    createDir(dirPath) {
        fs.mkdirSync(dirPath);
    }

    listDir(dirPath) {
        return fs.readdirSync(dirPath);
    }

    setup() {
        if (!this.pathExists(this.path)) {
            fs.mkdirSync(this.path);
        }
    }

    normalize(filePath) {
        return path.join(this.path, filePath);
    }

    writeData(data, filePath) {
        fs.writeFile(filePath, JSON.stringify(data), err => {
            if (err) return 1;
        });
        return 0;
    }

    readData(path) {
        let data;

        try {
            data = JSON.parse(fs.readFileSync(path));
        } catch (_) {
            data = {};
        }

        return data;
    }
}

module.exports = FileIO;
