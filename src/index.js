#!/usr/bin/env node

import fs from 'node:fs';
import { render } from "ejs";
import { Command } from "commander";
import path from 'node:path';

const template = `
function <%= name %>() {
    return '<%= name %>'
}
`.trim();

const log = console.log;

const srcDir = __dirname;
const targetDir = process.cwd();

const tempateSrcDir = path.resolve(srcDir, '../template')

const getTemplate = (src, name) => {
    const filePath = path.resolve(src, name);
    return fs.readFileSync(filePath, 'utf-8').trim();
}

export const isEmptyDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) return false;
    const files = fs.readdirSync(dirPath);
    return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

const generateCode = (template, data) => {
    return render(template, data);
}

const writeFile = (path, data) => {
    return fs.writeFileSync(path, data);
}

const writeTemplateToFile = (filePath, template, data) => {
    try {
        const code = generateCode(template, data);
        writeFile(filePath, code);
        log(`generate success`);
    } catch (error) {
        log(`generate error: ${error}`);
    } finally {
        log(`generate finished`);
    }
}

const compAction = (name) => {
    fs.mkdirSync(path.resolve(targetDir, `${name}`));
    const tsxTempate = getTemplate(tempateSrcDir, 'react.comp.ejs');
    writeTemplateToFile(path.resolve(targetDir, `${name}/index.tsx`), tsxTempate, {name});
    const scssTemplate = getTemplate(tempateSrcDir, 'scss.comp.ejs');
    writeTemplateToFile(path.resolve(targetDir, `${name}/index.module.scss`), scssTemplate, {name});
}

const program = new Command();

program
    .version('1.0.0-alpha')

program
    .command('comp')
    .argument('<name>')
    .action(compAction)

program.parse();