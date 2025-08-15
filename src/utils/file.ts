import fs from 'fs';

export function readFilePromise(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err === null) resolve(data);
            else reject(err);
        });
    });
}


