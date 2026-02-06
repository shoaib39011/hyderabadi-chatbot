
const fs = require('fs');
const path = require('path');

const uiDir = path.join(process.cwd(), 'src', 'components', 'ui');

const files = fs.readdirSync(uiDir);

files.forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const filePath = path.join(uiDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Remove interfaces and types (exported)
        content = content.replace(/^export (interface|type) [\s\S]*?\{[\s\S]*?\}/gm, '');
        content = content.replace(/^export type .*?;/gm, '');

        // 2. Remove non-exported types/interfaces
        content = content.replace(/^(interface|type) [\s\S]*?\{[\s\S]*?\}/gm, '');
        content = content.replace(/^type .*?;/gm, '');

        // 3. Remove React.forwardRef generics
        // Handle nested brackets like React.forwardRef<A, B<C>>
        content = content.replace(/React\.forwardRef<[\s\S]*?>(?=\s*\()/g, 'React.forwardRef');

        // 4. Remove type annotations in function signatures
        // e.g. (props: Props) => 
        content = content.replace(/:\s*React\.[A-Za-z]+<[^>]+>/g, '');
        content = content.replace(/:\s*HTML[A-Za-z]+Element/g, '');
        content = content.replace(/:\s*[A-Z][A-Za-z0-9_]+Props/g, '');
        content = content.replace(/:\s*[A-Z][A-Za-z0-9_]+/g, '');

        // 5. Remove "as React.CSSProperties" etc
        content = content.replace(/ as React\.[A-Za-z]+/g, '');
        content = content.replace(/ as const/g, '');

        // 6. Remove remaining TS junk in imports
        content = content.replace(/, type [A-Za-z0-9_]+/g, '');
        content = content.replace(/type [A-Za-z0-9_]+, /g, '');

        fs.writeFileSync(filePath, content);
        console.log(`Cleaned ${file}`);
    }
});
