'use strict';

/* eslint global-require:0 */

const fs = require('fs');
const path = require('path');
const readModuleNames = require('./read_module_names');
const readModule = require('./read_module');
const check = require('./check');

// Main function
function unpack(content, targetDir, modules) {
  const ms = (modules || []).map(m => require('../modules/' + m));

  const names = readModuleNames(content);
  let codes = names.map(item => {
    return {
      number: item.number,
      name: item.name,
      code: readModule(content, item.number, names) };
  });

  ms.forEach(m => {
    codes = m(codes);
  });

  codes.forEach(code => {
    fs.writeFileSync(path.join(targetDir, code.name + '.js'), code.code);
  });

  check(names, targetDir);

  console.log('done');
}

module.exports = unpack;
