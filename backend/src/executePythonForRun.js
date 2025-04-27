const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executePythonForRun = (filePath, pretestInput) => {
    const tempInputFilePath = `${filePath}_input.txt`;

    return new Promise((resolve, reject) => {
        fs.writeFile(tempInputFilePath, pretestInput, (writeError) => {
            if (writeError) {
                return reject(writeError);
            }

            const command = `python "${filePath}" < "${tempInputFilePath}"`;
            exec(command, (runError, runStdout, runStderr) => {
                fs.unlink(tempInputFilePath, (unlinkError) => {
                    if (unlinkError) {
                        console.error("Error cleaning up temp input file:", unlinkError);
                    }
                });

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
};

module.exports = executePythonForRun;
