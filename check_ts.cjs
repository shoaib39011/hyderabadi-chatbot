
const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const srcDir = path.join(process.cwd(), 'src');
const allFiles = walk(srcDir);

allFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('React.forwardRef<') || content.includes('interface ') || content.includes('type ') || content.includes(': React.')) {
        console.log(`STILL HAS TS: ${path.relative(process.cwd(), filePath)}`);
    }
});
