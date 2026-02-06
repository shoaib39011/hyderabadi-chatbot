
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

    // Pattern: React.forwardRef<...>(
    // We want to replace it with React.forwardRef((
    content = content.replace(/React\.forwardRef\s*<[\s\S]*?>(?=\s*\()/g, 'React.forwardRef');

    // Pattern: React.createContext<...>(
    content = content.replace(/React\.createContext\s*<[\s\S]*?>(?=\s*\()/g, 'React.createContext');

    // Any other generic matches before (
    content = content.replace(/([A-Z][A-Za-z0-9_]*)\s*<[\s\S]*?>(?=\s*\()/g, '$1');

    // Parameters with types
    // (props: Props, ref: React.Ref<...>) -> (props, ref)
    // This is a bit risky but let's try to target the most common ones
    content = content.replace(/:\s*React\.[A-Za-z0-9_]+(<[^>]*>)?/g, '');
    content = content.replace(/:\s*HTML[A-Za-z0-9]+Element/g, '');
    content = content.replace(/:\s*[A-Z][A-Za-z0-9_]+Props/g, '');
    content = content.replace(/:\s*[A-Z][A-Za-z0-9_]+Context/g, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Cleaned ${path.relative(process.cwd(), filePath)}`);
    }
});
