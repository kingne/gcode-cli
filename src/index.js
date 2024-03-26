#!/usr/bin/env node

import fs from 'node:fs';
import { render } from "ejs";
import { Command } from "commander";

const template = `
function <%= name %>() {
    return '<%= name %>'
}
`.trim();

const log = console.log;

const generateCode = (template, data) => {
    return render(template, data);
}

const writeFile = (path, data) => {
    return fs.writeFileSync(path, data);
}

const compAction = (name) => {
    log(`start generate ${name}`);
    try {
        const code = generateCode(template, {name});
        writeFile(`${name}.js`, code);
        log(`generate success`);
    } catch (error) {
        log(`generate error: ${error}`);
    } finally {
        log(`generate finished`);
    }
}

const program = new Command();

program
    .version('1.0.0-alpha')

program
    .command('comp')
    .argument('<name>')
    .action(compAction)