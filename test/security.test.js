const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const routeDir = path.join(root, 'routes');

function walk(dir) {
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walk(full));
        } else if (entry.name.endsWith('.js')) {
            files.push(full);
        }
    }
    return files;
}

const routeFiles = walk(routeDir);

test('no route file contains a hardcoded JWT secret', () => {
    for (const file of routeFiles) {
        const src = fs.readFileSync(file, 'utf8');
        assert.ok(
            !/SECRET_KEY\s*=\s*'[^']+'/.test(src),
            `Hardcoded SECRET_KEY assignment found in ${file}`
        );
        assert.ok(!src.includes('Arijit'), `Hardcoded secret value found in ${file}`);
    }
});

test('no route file uses string-interpolated SQL', () => {
    for (const file of routeFiles) {
        const src = fs.readFileSync(file, 'utf8');
        const lines = src.split('\n');
        lines.forEach((line, i) => {
            if (line.includes('${')) {
                assert.ok(
                    !line.includes('SELECT') && !line.includes('INSERT') && !line.includes('UPDATE') && !line.includes('DELETE'),
                    `Interpolated SQL in ${file}:${i + 1}`
                );
            }
        });
    }
});

test('every route module statically exports an express router', () => {
    for (const file of routeFiles) {
        const src = fs.readFileSync(file, 'utf8');
        assert.ok(
            /module\.exports\s*=\s*\w+/.test(src),
            `Module ${file} does not export a router`
        );
    }
});

test('.env.example exists with empty placeholders', () => {
    const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
    assert.match(env, /^SECRET_KEY=$/m, 'SECRET_KEY placeholder should be empty');
    assert.match(env, /^DB_HOST=/m);
    assert.match(env, /^DB_NAME=/m);
    assert.match(env, /^PORT=/m);
});
