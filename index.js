#!/usr/bin/env node

/* eslint no-console: 0 */

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package');
const fs = require('fs');
const moment = require('moment');
const unpack = require('./lib');

program
  .version(pkg.version)
  .command('unpack <source> <targetDir>')
  .action(function (source, _targetDir) {
    if (!fs.existsSync(source)) {
      throw new Error('source file not exists');
    }

    const targetDir = _targetDir || './';

    if (!fs.existsSync(targetDir)) {
      throw new Error('targetDir', targetDir, 'not exists');
    }

    const newTargetDir = path.join(targetDir, 'unwebpacked-' + moment().format('YYYYMMDD-HHmmss'));
    fs.mkdirSync(newTargetDir);
    console.log('Target folder created at', newTargetDir);

    const content = fs.readFileSync(source).toString();
    unpack(content, newTargetDir);
  });

program.parse(process.argv);
