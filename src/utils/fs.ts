import fs from 'fs'

export const createAndWrite = (fileName: string, content: string) => {
    fs.writeFileSync(fileName, content, 'utf8');
}