
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

    // 1. Remove all generic brackets after common React patterns
    // Pattern: Name<...>(
    const patterns = ['forwardRef', 'createContext', 'useRef', 'useState', 'useCallback', 'useMemo'];
    patterns.forEach(p => {
        let regex = new RegExp(`(${p})\\s*<`, 'g');
        content = content.replace(regex, (match, name) => {
            let startIdx = content.indexOf(match); // This is risky if multiple, but let's handle one by one or use a better approach
            return name + '<';
        });

        // Better approach for generics:
        let idx = -1;
        while ((idx = content.indexOf(p + '<', idx + 1)) !== -1 || (idx = content.indexOf(p + ' <', idx + 1)) !== -1) {
            let bracketStart = content.indexOf('<', idx);
            let bracketEnd = findClosingBracket(content, bracketStart);
            if (bracketEnd !== -1) {
                content = content.substring(0, bracketStart) + content.substring(bracketEnd + 1);
                idx = bracketStart; // continue from here
            } else {
                break;
            }
        }
    });

    // 2. Remove "type " and "interface " blocks
    content = content.replace(/^export\s+(type|interface)\s+[\s\S]*?\{[\s\S]*?\}/gm, '');
    content = content.replace(/^export\s+(type|interface)\s+.*?;/gm, '');
    content = content.replace(/^(type|interface)\s+[\s\S]*?\{[\s\S]*?\}/gm, '');
    content = content.replace(/^(type|interface)\s+.*?;/gm, '');
    content = content.replace(/import\s+type\s+[\s\S]*?from\s+["'].*?["'];?/g, '');
    content = content.replace(/,\s*type\s+[A-Za-z0-9_]+/g, '');
    content = content.replace(/type\s+[A-Za-z0-9_]+\s*,/g, '');

    // 3. Remove type annotations in parameters
    // (props: Props) -> (props)
    // Fix: handle (props: Props, ref: React.Ref<...>)
    // This is hard to do with regex perfectly, but let's try common ones
    content = content.replace(/:\s*React\.[A-Za-z]+(<[^>]*>)?/g, '');
    content = content.replace(/:\s*HTML[A-Za-z0-9]+Element/g, '');
    content = content.replace(/:\s*[A-Z][A-Za-z0-9_]+Props/g, '');
    content = content.replace(/:\s*[A-Z][A-Za-z0-9_]+Context/g, '');
    content = content.replace(/:\s*VariantProps<[^>]*>/g, '');

    // 4. Remove "as Type"
    content = content.replace(/\s+as\s+React\.[A-Za-z0-9_]+(<[^>]*>)?/g, '');
    content = content.replace(/\s+as\s+const/g, '');
    content = content.replace(/\s+as\s+any/g, '');

    // 5. Clean react imports
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+["']react["']/g, (match, typesPart) => {
        const types = typesPart.split(',').map(t => t.trim());
        const validHooks = ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue', 'useDeferredValue', 'useTransition', 'useId', 'useSyncExternalStore', 'useInsertionEffect', 'createContext', 'forwardRef', 'memo', 'Component', 'PureComponent', 'Fragment', 'Profiler', 'StrictMode', 'Suspense', 'lazy'];
        const filtered = types.filter(t => validHooks.includes(t) && t !== '');
        if (filtered.length === 0) return 'import * as React from "react"';
        return `import { ${filtered.join(', ')} } from "react"`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Cleaned ${path.relative(process.cwd(), filePath)}`);
    }
});

function findClosingBracket(str, startIdx) {
    let depth = 0;
    for (let i = startIdx; i < str.length; i++) {
        if (str[i] === '<') depth++;
        else if (str[i] === '>') {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}
