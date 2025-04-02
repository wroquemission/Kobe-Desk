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
        try {
            return fs.readdirSync(dirPath);
        } catch (_) {
            return [];
        }
    }

    setup() {
        if (!this.pathExists(this.path)) {
            fs.mkdirSync(this.path);
        }
    }

    normalize(filePath) {
        return path.join(this.path, filePath);
    }

    write(filePath, data, isBase64) {
        if (isBase64) {
            data = data.toString().replace(/^data:image\/jpeg;base64,/, '');
            fs.writeFile(filePath, data, 'base64', () => { });
        } else {
            fs.writeFile(filePath, data, () => { });
        }
    }

    writeData(data, filePath) {
        fs.writeFile(filePath, JSON.stringify(data), () => {});
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
