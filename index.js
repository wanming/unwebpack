#!/usr/bin/env node

/* eslint no-console: 0 */

'use strict';

const program = require('commander');
const pkg = require('./package');
const fs = require('fs');
const unpack = require('./lib');

program
  .version(pkg.version)
  .command('unpack <source> <targetDir> [modules...]')
  .action(function (source, _targetDir, modules) {
    if (!fs.existsSync(source)) {
      throw new Error('source file not exists');
    }

    const targetDir = _targetDir || './';

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    if (fs.readdirSync(targetDir).length > 2) {
      throw new Error('targetDir must be empty');
    }

    console.log('Target folder is', targetDir);

    const content = fs.readFileSync(source).toString();
    unpack(content, targetDir, modules);
  });

program.parse(process.argv);
