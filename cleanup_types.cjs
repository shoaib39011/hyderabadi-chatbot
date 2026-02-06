
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
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove TS type imports from react
    // e.g. import { ReactNode, FC } from "react" -> import {  } from "react"
    // We need to be careful not to remove hooks like useState
    const reactTypeMatches = content.match(/import\s+\{([^}]+)\}\s+from\s+["']react["']/);
    if (reactTypeMatches) {
        let typesPart = reactTypeMatches[1];
        const types = typesPart.split(',').map(t => t.trim());
        const validHooks = ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue', 'useDeferredValue', 'useTransition', 'useId', 'useSyncExternalStore', 'useInsertionEffect', 'createContext', 'forwardRef', 'memo', 'Component', 'PureComponent', 'Fragment', 'Profiler', 'StrictMode', 'Suspense', 'lazy'];

        const filteredTypes = types.filter(t => validHooks.includes(t) || t === '');
        const newTypesPart = filteredTypes.join(', ');

        if (filteredTypes.length === 0) {
            content = content.replace(/import\s+\{[^}]+\}\s+from\s+["']react["'];?\n?/, '');
        } else {
            content = content.replace(/import\s+\{[^}]+\}\s+from\s+["']react["']/, `import { ${newTypesPart} } from "react"`);
        }
    }

    // 2. Remove other common TS pattern: import type ...
    content = content.replace(/^import type .*?;?\n/gm, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Cleaned ${path.relative(process.cwd(), filePath)}`);
    }
});
