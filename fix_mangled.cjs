
const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.resolve(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else {
            if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const srcDir = path.join(process.cwd(), 'src');
const allFiles = walk(srcDir);

allFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix the specific mangled pattern
    // Pattern 1: forwardRef, \n React.ComponentPropsWithoutRef(
    content = content.replace(/forwardRef,\s+(React\.)?ComponentPropsWithoutRef\(/g, 'forwardRef(');

    // Pattern 2: createContext( \n { (this might have been from a generic match)
    // Actually, ToggleGroupContext was: createContext({

    // Pattern 3: Any leftover ">("
    content = content.replace(/>\(\(\{/g, '(({');
    content = content.replace(/>\(\(/g, '((');

    // Pattern 4: any "as React.RefAttributes<...>" or similar
    content = content.replace(/\s+as\s+React\.RefAttributes<[^>]*>/g, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Fixed mangled ${path.relative(process.cwd(), filePath)}`);
    }
});
