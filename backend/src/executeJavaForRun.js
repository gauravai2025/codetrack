const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJavaForRun = (filePath, pretestInput) => {
    const dir = path.dirname(filePath);
    const tempInputFilePath = path.join(dir, `Main_input.txt`);

    return new Promise((resolve, reject) => {
        fs.writeFile(tempInputFilePath, pretestInput, (writeError) => {
            if (writeError) {
                return reject(writeError);
            }

            const compileCommand = `javac "${filePath}"`;
            exec(compileCommand, (compileError, stdout, stderr) => {
                if (compileError) {
                    cleanupFiles([filePath, tempInputFilePath]);
                    return reject(compileError);
                }
                if (stderr) {
                    cleanupFiles([filePath, tempInputFilePath]);
                    return reject(stderr);
                }

                const command = `java -cp "${dir}" Main < "${tempInputFilePath}"`;
                exec(command, (runError, runStdout, runStderr) => {
                    cleanupFiles([filePath, tempInputFilePath]);

                    if (runError) {
                        return reject(runError);
                    }
                    if (runStderr) {
                        return reject(runStderr);
                    }
                    resolve(runStdout);
                });
            });
        });
    });
};

const cleanupFiles = (files) => {
    files.forEach(file => {
        fs.unlink(file, (err) => {
            if (err) console.error(`Error deleting file ${file}:`, err);
        });
    });
};

module.exports = executeJavaForRun;
